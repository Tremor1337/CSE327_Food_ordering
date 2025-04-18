// backend/patterns/observer/OrderNotifier.js

class OrderNotifier {
    constructor() {
        this.subscribers = [];
    }

    subscribe(user) {
        this.subscribers.push(user);
    }

    unsubscribe(user) {
        this.subscribers = this.subscribers.filter(sub => sub !== user);
    }

    notify(message) {
        this.subscribers.forEach(user => user.update(message));
    }
}

class Subscriber {
    constructor(username) {
        this.username = username;
    }

    update(message) {
        console.log(`[${this.username}] Notification: ${message}`);
    }
}

module.exports = { OrderNotifier, Subscriber };
