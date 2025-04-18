// backend/patterns/adapter/ETAServiceAdapter.js

// Simulated external API class (mock 3rd-party service)
class FoodieMapAPI {
    getEstimatedTime(destination) {
        const baseTime = 10;
        const randomFactor = destination.length % 10;
        return baseTime + randomFactor;
    }
}

// Adapter to unify access to ETA logic
class ETAServiceAdapter {
    constructor() {
        this.externalMap = new FoodieMapAPI();
    }

    getETA(destination) {
        const minutes = this.externalMap.getEstimatedTime(destination);
        return `Estimated delivery time to '${destination}' is ${minutes} minutes.`;
    }
}

module.exports = ETAServiceAdapter;
