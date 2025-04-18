const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const AdminProxy = require('../patterns/proxy/AdminProxy');
const Logger = require('../patterns/singleton/Logger');
const db = require('../database');
const fs = require('fs');
const path = require('path');


router.get('/users', authenticate, (req, res) => {
  const proxy = new AdminProxy(req.user);
  const result = proxy.accessSecretData();

  if (result.includes('Access denied')) {
    return res.status(403).json({ message: result });
  }

  db.all('SELECT id, username, role FROM users', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    return res.json({ users: rows });
  });
});


router.delete('/users/:id', authenticate, (req, res) => {
  const proxy = new AdminProxy(req.user);
  const result = proxy.accessSecretData();

  if (result.includes('Access denied')) {
    return res.status(403).json({ message: result });
  }

  const { id } = req.params;

  db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete user' });
    }

    Logger.log(`🗑️ Admin '${req.user.username}' deleted user ID ${id}`);
    return res.json({ message: `User with ID ${id} deleted` });
  });
});


router.put('/users/:id/role', authenticate, (req, res) => {
  const proxy = new AdminProxy(req.user);
  const result = proxy.accessSecretData();

  if (result.includes('Access denied')) {
    return res.status(403).json({ message: result });
  }

  const { id } = req.params;
  const { role } = req.body;

  db.run('UPDATE users SET role = ? WHERE id = ?', [role, id], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Failed to update role' });
    }

    Logger.log(`Admin '${req.user.username}' changed role of user ID ${id} to '${role}'`);
    return res.json({ message: `Role updated to '${role}' for user ID ${id}` });
  });
});

router.get('/logs', authenticate, (req, res) => {
  console.log("/admin/logs endpoint HIT");

  const proxy = new AdminProxy(req.user);
  const result = proxy.accessSecretData();

  if (result.includes('Access denied')) {
    return res.status(403).json({ message: result });
  }

  const logPath = path.resolve(__dirname, '../logs/system.log');

  if (fs.existsSync(logPath)) {
    const logs = fs.readFileSync(logPath, 'utf8').trim();

    console.log("Logs read content:\n", logs); // <--- FULL LOG DUMP

    Logger.log(`Admin '${req.user.username}' viewed system logs`);
    return res.type('text/plain').send(logs);
  } else {
    console.log("Log file not found at:", logPath);
    return res.type('text/plain').send('No logs yet.');
  }
});


module.exports = router;
