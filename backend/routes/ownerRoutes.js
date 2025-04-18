const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticate } = require('../middleware/authMiddleware');
const Logger = require('../patterns/singleton/Logger');

function getRestaurantIdByOwner(username, callback) {
  db.get('SELECT id FROM restaurants WHERE name = ?', [username], (err, row) => {
    if (err || !row) return callback(null); // Assume restaurant name = owner username
    callback(row.id);
  });
}

// View menu items
router.get('/menu', authenticate, (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ message: 'Forbidden' });

  getRestaurantIdByOwner(req.user.username, (restaurantId) => {
    if (!restaurantId) return res.status(404).json({ message: 'Restaurant not found' });

    db.all('SELECT * FROM menu_items WHERE restaurant_id = ?', [restaurantId], (err, rows) => {
      if (err) return res.status(500).json({ message: 'Failed to fetch menu' });

      Logger.log(`Owner '${req.user.username}' viewed their menu items.`);
      res.json({ menu: rows });
    });
  });
});

// Add menu item
router.post('/menu', authenticate, (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ message: 'Forbidden' });

  const { name, price } = req.body;
  if (!name || !price) return res.status(400).json({ message: 'Missing name or price' });

  getRestaurantIdByOwner(req.user.username, (restaurantId) => {
    if (!restaurantId) return res.status(404).json({ message: 'Restaurant not found' });

    db.run(
      'INSERT INTO menu_items (restaurant_id, name, price) VALUES (?, ?, ?)',
      [restaurantId, name, price],
      function (err) {
        if (err) return res.status(500).json({ message: 'Failed to add item' });

        Logger.log(`➕ Owner '${req.user.username}' added menu item '${name}' ($${price})`);
        res.status(201).json({ message: 'Item added', id: this.lastID });
      }
    );
  });
});

// Update menu item
router.put('/menu/:id', authenticate, (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ message: 'Forbidden' });

  const { name, price } = req.body;
  const { id } = req.params;

  getRestaurantIdByOwner(req.user.username, (restaurantId) => {
    if (!restaurantId) return res.status(404).json({ message: 'Restaurant not found' });

    db.run(
      'UPDATE menu_items SET name = ?, price = ? WHERE id = ? AND restaurant_id = ?',
      [name, price, id, restaurantId],
      function (err) {
        if (err) return res.status(500).json({ message: 'Failed to update item' });

        Logger.log(`Owner '${req.user.username}' updated item ID ${id} to '${name}' ($${price})`);
        res.json({ message: 'Item updated' });
      }
    );
  });
});

// Delete menu item
router.delete('/menu/:id', authenticate, (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ message: 'Forbidden' });

  const { id } = req.params;

  getRestaurantIdByOwner(req.user.username, (restaurantId) => {
    if (!restaurantId) return res.status(404).json({ message: 'Restaurant not found' });

    db.run(
      'DELETE FROM menu_items WHERE id = ? AND restaurant_id = ?',
      [id, restaurantId],
      function (err) {
        if (err) return res.status(500).json({ message: 'Failed to delete item' });

        Logger.log(`Owner '${req.user.username}' deleted menu item ID ${id}`);
        res.json({ message: 'Item deleted' });
      }
    );
  });
});

// View restaurant info
router.get('/restaurant', authenticate, (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ message: 'Forbidden' });

  db.get('SELECT * FROM restaurants WHERE name = ?', [req.user.username], (err, row) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch restaurant' });

    Logger.log(`Owner '${req.user.username}' viewed restaurant info.`);
    res.json({ restaurant: row });
  });
});

// Create restaurant
router.post('/restaurant', authenticate, (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ message: 'Forbidden' });

  const { location } = req.body;
  const name = req.user.username;

  db.run(
    'INSERT INTO restaurants (name, location) VALUES (?, ?)',
    [name, location],
    function (err) {
      if (err) return res.status(500).json({ message: 'Failed to create restaurant' });

      Logger.log(`🏗️ Owner '${name}' created a restaurant at '${location}'.`);
      res.status(201).json({ message: 'Restaurant created', id: this.lastID });
    }
  );
});

// Update restaurant
router.put('/restaurant', authenticate, (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ message: 'Forbidden' });

  const { location } = req.body;

  db.run(
    'UPDATE restaurants SET location = ? WHERE name = ?',
    [location, req.user.username],
    function (err) {
      if (err) return res.status(500).json({ message: 'Failed to update restaurant' });

      Logger.log(`Owner '${req.user.username}' updated restaurant location to '${location}'.`);
      res.json({ message: 'Restaurant updated' });
    }
  );
});

module.exports = router;
