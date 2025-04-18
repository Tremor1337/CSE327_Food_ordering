const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticate } = require('../middleware/authMiddleware');
const Logger = require('../patterns/singleton/Logger');
const { OrderNotifier, Subscriber } = require('../patterns/observer/OrderNotifier');

// 🧾 Get all orders
router.get('/orders', authenticate, (req, res) => {
  if (req.user.role !== 'delivery') return res.status(403).json({ message: 'Forbidden' });

  const query = `
    SELECT orders.id, orders.status, orders.total, orders.created_at,
           users.username AS customer
    FROM orders
    JOIN users ON orders.user_id = users.id
    ORDER BY orders.created_at DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch orders' });
    res.json({ orders: rows });
  });
});

// 🔄 Update order status
router.put('/orders/:id/status', authenticate, (req, res) => {
  if (req.user.role !== 'delivery') return res.status(403).json({ message: 'Forbidden' });

  const { status, customer } = req.body;
  const { id } = req.params;

  db.run(`UPDATE orders SET status = ? WHERE id = ?`, [status, id], function (err) {
    if (err) return res.status(500).json({ message: 'Failed to update status' });

    // Notify observer
    const notifier = new OrderNotifier();
    const subscriber = new Subscriber(customer);
    notifier.subscribe(subscriber);
    notifier.notify(`📦 Order #${id} status updated to '${status}'`);

    Logger.log(`🚚 Delivery updated order #${id} for customer '${customer}' to '${status}'`);
    res.json({ message: `Order #${id} updated to '${status}'` });
  });
});

module.exports = router;
