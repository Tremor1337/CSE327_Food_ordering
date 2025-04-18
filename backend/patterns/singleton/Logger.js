// backend/patterns/singleton/Logger.js

const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    if (Logger.instance) {
      return Logger.instance;
    }
    Logger.instance = this;

    this.logFilePath = path.resolve(__dirname, '../../logs/system.log');
    fs.mkdirSync(path.dirname(this.logFilePath), { recursive: true });
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const fullMessage = `[${timestamp}] ${message}\n`;

    // Log to console
    console.log(fullMessage.trim());

    // Append to log file
    fs.appendFileSync(this.logFilePath, fullMessage, 'utf8');
  }
}

module.exports = new Logger();
