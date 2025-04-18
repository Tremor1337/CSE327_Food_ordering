// backend/patterns/facade/OrderFacade.js
const db = require('../../database');
const Logger = require('../singleton/Logger');
const { OrderNotifier, Subscriber } = require('../observer/OrderNotifier');
const {
    PaymentContext,
    CreditCardPayment,
    PayPalPayment,
    CashPayment
} = require('../strategy/PaymentStrategy');

class OrderFacade {
    constructor(username, paymentMethod) {
        this.username = username;
        this.paymentMethod = paymentMethod;
        this.user = new Subscriber(username);
        this.notifier = new OrderNotifier();
        this.notifier.subscribe(this.user);
        this.payment = new PaymentContext();

        switch (paymentMethod) {
            case 'credit':
                this.payment.setStrategy(new CreditCardPayment());
                break;
            case 'paypal':
                this.payment.setStrategy(new PayPalPayment());
                break;
            case 'cash':
            default:
                this.payment.setStrategy(new CashPayment());
        }
    }

    async placeOrder(orderAmount) {
        Logger.log(`🆕 New order placed by '${this.username}'`);

        this.notifier.notify('Your order has been received');
        this.notifier.notify('Preparing your food');
        this.notifier.notify('Out for delivery');

        const paymentResult = this.payment.executePayment(orderAmount);
        Logger.log(`💰 Payment processed: ${paymentResult}`);

        return new Promise((resolve, reject) => {
            db.get('SELECT id FROM users WHERE username = ?', [this.username], (err, userRow) => {
                if (err || !userRow) return reject('User not found');

                // For simplicity, assign restaurant ID 1 to all orders (or choose randomly)
                const restaurantId = 1;

                db.run(
                    'INSERT INTO orders (user_id, restaurant_id, status, total) VALUES (?, ?, ?, ?)',
                    [userRow.id, restaurantId, 'confirmed', orderAmount],
                    function (err) {
                        if (err) return reject('Failed to save order');

                        

                        resolve({
                            message: `Order placed successfully (ID ${this.lastID})`,
                            payment: paymentResult
                        });
                    }
                );
            });
        });
    }
}

module.exports = OrderFacade;
