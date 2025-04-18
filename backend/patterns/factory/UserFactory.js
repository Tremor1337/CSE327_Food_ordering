// backend/patterns/factory/UserFactory.js

class User {
    constructor(username) {
        this.username = username;
    }
}

class Customer extends User {
    role = 'customer';
    access() {
        return 'Customer dashboard';
    }
}

class RestaurantOwner extends User {
    role = 'owner';
    access() {
        return 'Owner dashboard';
    }
}

class DeliveryPersonnel extends User {
    role = 'delivery';
    access() {
        return 'Delivery panel';
    }
}

class Admin extends User {
    role = 'admin';
    access() {
        return 'Admin dashboard';
    }
}

class UserFactory {
    static createUser(role, username) {
        switch (role) {
            case 'customer':
                return new Customer(username);
            case 'owner':
                return new RestaurantOwner(username);
            case 'delivery':
                return new DeliveryPersonnel(username);
            case 'admin':
                return new Admin(username);
            default:
                throw new Error('Unknown role type');
        }
    }
}

module.exports = UserFactory;
