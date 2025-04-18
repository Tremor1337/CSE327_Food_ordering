// backend/controllers/authController.js
const db = require('../database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserFactory = require('../patterns/factory/UserFactory');
const Logger = require('../patterns/singleton/Logger');

const SECRET_KEY = 'your_secret_key_here'; // Use env var in production

exports.signup = async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [username, hashedPassword, role],
        function (err) {
            if (err) {
                console.error(err);
                Logger.log(`Failed signup attempt for '${username}' (${role})`);
                return res.status(500).json({ message: 'Signup failed' });
            }

            const userObj = UserFactory.createUser(role, username);
            Logger.log(`New user signed up: '${username}' as ${role}`);

            return res.status(201).json({
                message: 'User created',
                id: this.lastID,
                user: {
                    username: userObj.username,
                    role: userObj.role,
                    dashboard: userObj.access()
                }
            });
        }
    );
};

exports.login = (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err || !user) {
            Logger.log(`Failed login attempt for '${username}' (user not found)`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            Logger.log(`Failed login attempt for '${username}' (wrong password)`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        const userObj = UserFactory.createUser(user.role, user.username);
        Logger.log(`User logged in: '${user.username}' as ${user.role}`);

        res.json({
            token,
            user: {
                username: userObj.username,
                role: userObj.role,
                dashboard: userObj.access()
            }
        });
    });
};
