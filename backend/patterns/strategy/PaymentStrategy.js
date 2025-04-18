// backend/patterns/strategy/PaymentStrategy.js

class PaymentStrategy {
    pay(orderAmount) {
        throw new Error("Method 'pay()' must be implemented.");
    }
}

class CreditCardPayment extends PaymentStrategy {
    pay(orderAmount) {
        return `Paid $${orderAmount} using Credit Card`;
    }
}

class PayPalPayment extends PaymentStrategy {
    pay(orderAmount) {
        return `Paid $${orderAmount} using PayPal`;
    }
}

class CashPayment extends PaymentStrategy {
    pay(orderAmount) {
        return `Will pay $${orderAmount} with Cash on Delivery`;
    }
}

class PaymentContext {
    setStrategy(strategy) {
        this.strategy = strategy;
    }

    executePayment(orderAmount) {
        if (!this.strategy) throw new Error("Payment strategy not set.");
        return this.strategy.pay(orderAmount);
    }
}

module.exports = {
    PaymentStrategy,
    CreditCardPayment,
    PayPalPayment,
    CashPayment,
    PaymentContext
};
