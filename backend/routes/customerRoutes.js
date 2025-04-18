// backend/routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../database');
const Logger = require('../patterns/singleton/Logger');

// GET all menu items
router.get('/menu', (req, res) => {
  const query = `
    SELECT menu_items.id, menu_items.name, menu_items.price,
           restaurants.name AS restaurant_name, restaurants.location
    FROM menu_items
    JOIN restaurants ON menu_items.restaurant_id = restaurants.id
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Failed to fetch customer menu:', err.message);
      return res.status(500).json({ message: 'Error fetching menu items' });
    }

    Logger.log(`🍽️ Customer fetched menu (${rows.length} items)`);
    res.json({ menu: rows });
  });
});

// GET all past orders for a specific user
router.get('/orders/:username', (req, res) => {
  const username = req.params.username;

  const query = `
    SELECT orders.id, orders.status, orders.total, orders.created_at
    FROM orders
    JOIN users ON orders.user_id = users.id
    WHERE users.username = ?
    ORDER BY orders.created_at DESC
  `;

  db.all(query, [username], (err, rows) => {
    if (err) {
      console.error('Failed to fetch orders:', err.message);
      return res.status(500).json({ message: 'Error fetching orders' });
    }

    Logger.log(`📦 Orders fetched for user '${username}' (${rows.length} entries)`);
    res.json({ orders: rows });
  });
});

// GET live status of all active orders (non-delivered) for a user
router.get('/status/:username', (req, res) => {
  const { username } = req.params;

  const query = `
    SELECT orders.id, orders.status
    FROM orders
    JOIN users ON users.id = orders.user_id
    WHERE users.username = ?
    ORDER BY orders.created_at DESC
  `;

  db.all(query, [username], (err, rows) => {
    if (err) {
      console.error('Failed to fetch order statuses:', err.message);
      return res.status(500).json({ message: 'Error fetching order statuses' });
    }

    const activeOrders = rows.filter(order => order.status !== 'delivered');

    Logger.log(`📡 Active statuses for '${username}': ${activeOrders.length} tracked`);
    res.json({ statuses: activeOrders });
  });
});

module.exports = router;
