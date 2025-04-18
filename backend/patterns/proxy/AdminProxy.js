// backend/patterns/proxy/AdminProxy.js

class AdminService {
    accessSecretData() {
        return "Accessing sensitive admin-only reports...";
    }
}

class AdminProxy {
    constructor(user) {
        this.user = user;
        this.service = new AdminService();
    }

    accessSecretData() {
        if (this.user.role !== 'admin') {
            return "Access denied: Admins only.";
        }
        return this.service.accessSecretData();
    }
}

module.exports = AdminProxy;
