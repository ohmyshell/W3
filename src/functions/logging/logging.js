const fs = require('fs');
const path = require('path');

module.exports = async () => {
  // Helper function to format the log entry
  const addLog = (logType, ...args) => {
    const logEntry = `[${new Date().toLocaleString()}] [${logType.toUpperCase()}]: ${args
      .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : arg))
      .join(' ')}`;
    return logEntry;
  };

  // Path to the log file in the same directory as this script
  const logFilePath = path.join(__dirname, '../../logs/logs.txt');

  // Function to append log entries to the file
  const appendToFile = (logEntry) => {
    fs.appendFile(logFilePath, logEntry + '\n', (err) => {
      if (err) {
        console.error('Failed to write to log file:', err);
      }
    });
  };

  // Save the original console methods
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  // Override console.log
  console.log = function (...args) {
    const logEntry = addLog('log', ...args);
    originalLog(logEntry);
    appendToFile(logEntry);
  };

  // Override console.warn
  console.warn = function (...args) {
    const logEntry = addLog('warn', ...args);
    originalWarn(logEntry);
    appendToFile(logEntry);
  };

  // Override console.error
  console.error = function (...args) {
    const logEntry = addLog('error', ...args);
    originalError(logEntry);
    appendToFile(logEntry);
  };
};
