const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'quiz.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
    return;
  }
  console.log('Connected to SQLite database');

  // Create tables
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS quiz_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        total_score INTEGER NOT NULL,
        completion_date DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS section_scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        result_id INTEGER,
        section_title TEXT NOT NULL,
        score INTEGER NOT NULL,
        max_score INTEGER NOT NULL,
        FOREIGN KEY (result_id) REFERENCES quiz_results (id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS detailed_answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        result_id INTEGER,
        section_title TEXT NOT NULL,
        question_text TEXT NOT NULL,
        answer_text TEXT NOT NULL,
        score INTEGER NOT NULL,
        FOREIGN KEY (result_id) REFERENCES quiz_results (id)
      )
    `);
  });
});

// Helper function to run queries with promises
const runQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

// Helper function to get results with promises
const getResults = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

module.exports = {
  db,
  runQuery,
  getResults
};
