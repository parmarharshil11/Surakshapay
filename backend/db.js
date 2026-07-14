const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'history.json');

// Initialize database file if it doesn't exist
if (!fs.existsSync(DB_PATH)) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2), 'utf8');
  } catch (error) {
    console.error("Error creating database file:", error);
  }
}

/**
 * Reads all entries from the history log.
 */
function getHistory() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return [];
    }
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error("Error reading from database:", error);
    return [];
  }
}

/**
 * Adds an entry to the history log.
 */
function addHistoryEntry(entry) {
  try {
    const history = getHistory();
    const newEntry = {
      id: 'check_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      ...entry
    };
    history.unshift(newEntry); // Insert at beginning so newest is first
    
    // Limit history to last 50 entries
    const truncatedHistory = history.slice(0, 50);
    
    fs.writeFileSync(DB_PATH, JSON.stringify(truncatedHistory, null, 2), 'utf8');
    return newEntry;
  } catch (error) {
    console.error("Error writing to database:", error);
    return null;
  }
}

/**
 * Clears all history entries.
 */
function clearHistory() {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error("Error clearing database:", error);
    return false;
  }
}

module.exports = {
  getHistory,
  addHistoryEntry,
  clearHistory
};
