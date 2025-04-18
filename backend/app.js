// backend/app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);
const { authenticate, authorize } = require('./middleware/authMiddleware');

app.get('/protected', authenticate, (req, res) => {
    res.json({ message: `Hello, ${req.user.username}! Your role is ${req.user.role}` });
});

app.get('/admin-only', authenticate, authorize('admin'), (req, res) => {
    res.json({ message: 'Welcome Admin!' });
});


const db = require('./database');

app.get('/test-db', (req, res) => {
    db.get('SELECT datetime("now") as time', [], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ success: false });
        } else {
            res.json({ success: true, time: row.time });
        }
    });
});
// Test route
app.get('/', (req, res) => {
    res.send('Food Ordering System Backend is Running!');
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
const UserFactory = require('./patterns/factory/UserFactory');

app.get('/factory-test', (req, res) => {
    const user = UserFactory.createUser('owner', 'zahin');
    res.json({
        username: user.username,
        role: user.role,
        dashboard: user.access()
    });
});
const {
    CreditCardPayment,
    PayPalPayment,
    CashPayment,
    PaymentContext
} = require('./patterns/strategy/PaymentStrategy');

app.get('/pay/:method/:amount', (req, res) => {
    const { method, amount } = req.params;
    const context = new PaymentContext();

    switch (method.toLowerCase()) {
        case 'credit':
            context.setStrategy(new CreditCardPayment());
            break;
        case 'paypal':
            context.setStrategy(new PayPalPayment());
            break;
        case 'cash':
            context.setStrategy(new CashPayment());
            break;
        default:
            return res.status(400).json({ message: 'Invalid payment method' });
    }

    const result = context.executePayment(amount);
    res.json({ message: result });
});
const { OrderNotifier, Subscriber } = require('./patterns/observer/OrderNotifier');

app.get('/order/track/:user', (req, res) => {
    const notifier = new OrderNotifier();

    const customer = new Subscriber(req.params.user);
    const deliveryGuy = new Subscriber('delivery_agent');

    notifier.subscribe(customer);
    notifier.subscribe(deliveryGuy);

    notifier.notify('Order confirmed');
    notifier.notify('Order is being prepared');
    notifier.notify('Out for delivery');

    res.json({ message: 'Notifications sent to subscribers.' });
});

const ETAServiceAdapter = require('./patterns/adapter/ETAServiceAdapter');

app.get('/delivery/eta/:address', (req, res) => {
    const adapter = new ETAServiceAdapter();
    const message = adapter.getETA(req.params.address);
    res.json({ message });
});
const OrderFacade = require('./patterns/facade/OrderFacade');

app.get('/order/place/:user/:amount/:method', (req, res) => {
    const { user, amount, method } = req.params;
    const order = new OrderFacade(user, method);
    const result = order.placeOrder(amount);
    res.json(result);
});
const AdminProxy = require('./patterns/proxy/AdminProxy');

// Admin-only report access using Proxy Pattern
app.get('/admin/reports', authenticate, (req, res) => {
    const proxy = new AdminProxy(req.user); // req.user comes from JWT middleware
    const result = proxy.accessSecretData();
    res.json({ message: result });
});
const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);
const ownerRoutes = require('./routes/ownerRoutes');
app.use('/owner', ownerRoutes);
const customerRoutes = require('./routes/customerRoutes');
app.use('/customer', customerRoutes);
const deliveryRoutes = require('./routes/deliveryRoutes');
app.use('/delivery', deliveryRoutes);