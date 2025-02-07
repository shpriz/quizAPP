const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const ExcelJS = require('exceljs');

const app = express();
app.use(cors({
  origin: [
    'http://stomtest.nsmu.ru:5173',
    'http://stomtest.nsmu.ru',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ],
  credentials: true
}));
app.use(express.json());

// Read quiz data from JSON file
const quizData = JSON.parse(fs.readFileSync(path.join(__dirname, 'quiz-data.json'), 'utf8'));

// Initialize database
const dbPath = path.join(__dirname, 'data', 'quiz.db');
const dbDir = path.dirname(dbPath);

// Create data directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS quiz_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    total_score INTEGER NOT NULL,
    test1_score INTEGER,
    test2_score INTEGER,
    test3_score INTEGER,
    test4_score INTEGER,
    test1_result TEXT,
    test2_result TEXT,
    test3_result TEXT,
    test4_result TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS section_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    result_id INTEGER NOT NULL,
    section_title TEXT NOT NULL,
    score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    section_result TEXT NOT NULL,
    FOREIGN KEY (result_id) REFERENCES quiz_results(id)
  );

  CREATE TABLE IF NOT EXISTS detailed_answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    result_id INTEGER NOT NULL,
    section_title TEXT NOT NULL,
    question_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    answer_text TEXT NOT NULL,
    answer_index INTEGER NOT NULL,
    possible_score INTEGER NOT NULL,
    score INTEGER NOT NULL,
    FOREIGN KEY (result_id) REFERENCES quiz_results(id)
  );
`);

// Initialize database tables - only called from admin panel
async function initializeDatabase() {
  try {
    // Drop existing tables
    db.exec('DROP TABLE IF EXISTS detailed_answers');
    db.exec('DROP TABLE IF EXISTS section_scores');
    db.exec('DROP TABLE IF EXISTS quiz_results');

    // Create tables with updated schema
    db.exec(`
      CREATE TABLE IF NOT EXISTS quiz_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        total_score INTEGER NOT NULL,
        test1_score INTEGER,
        test2_score INTEGER,
        test3_score INTEGER,
        test4_score INTEGER,
        test1_result TEXT,
        test2_result TEXT,
        test3_result TEXT,
        test4_result TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS section_scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        result_id INTEGER NOT NULL,
        section_title TEXT NOT NULL,
        score INTEGER NOT NULL,
        max_score INTEGER NOT NULL,
        section_result TEXT NOT NULL,
        FOREIGN KEY (result_id) REFERENCES quiz_results(id)
      );

      CREATE TABLE IF NOT EXISTS detailed_answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        result_id INTEGER NOT NULL,
        section_title TEXT NOT NULL,
        question_id INTEGER NOT NULL,
        question_text TEXT NOT NULL,
        answer_text TEXT NOT NULL,
        answer_index INTEGER NOT NULL,
        possible_score INTEGER NOT NULL,
        score INTEGER NOT NULL,
        FOREIGN KEY (result_id) REFERENCES quiz_results(id)
      );
    `);

    console.log('Database tables recreated successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

function calculateTestResult(testNumber, score) {
  // Блок 1: "Уход за полостью рта у жителей психоневрологических интернатов"
  if (testNumber === 1) {
    if (score >= 13 && score <= 23) {
      return 'высокий уровень ухода за полостью рта у жителей психоневрологических интернатов';
    } else if (score >= 24 && score <= 34) {
      return 'удовлетворительный уровень ухода за полостью рта у жителей психоневрологических интернатов';
    } else if (score >= 35 && score <= 45) {
      return 'неудовлетворительный уровень ухода за полостью рта у жителей психоневрологических интернатов';
    } else if (score >= 46) {
      return 'низкий уровень ухода за полостью рта у жителей психоневрологических интернатов';
    }
  }
  
  // Блок 2: "Стоматологическая помощь, оказываемая жителям психоневрологического интерната и ее качество"
  if (testNumber === 2) {
    if (score >= 10 && score <= 18) {
      return 'высокий уровень оказания стоматологической помощи жителям психоневрологических интернатов';
    } else if (score >= 19 && score <= 28) {
      return 'удовлетворительный уровень оказания стоматологической помощи жителям психоневрологических интернатов';
    } else if (score >= 29 && score <= 35) {
      return 'неудовлетворительный уровень оказания стоматологической помощи жителям психоневрологических интернатов';
    } else if (score >= 36) {
      return 'низкий уровень оказания стоматологической помощи жителям психоневрологических интернатов';
    }
  }
  
  // Блок 3: "Образ жизни и питание жителей психоневрологических интернатов"
  if (testNumber === 3) {
    if (score >= 8 && score <= 15) {
      return 'большинство жителей психоневрологических интернатов ведут здоровый образ жизни или близкий к нему';
    } else if (score >= 16 && score <= 23) {
      return 'меньшинство жителей психоневрологических интернатов ведут здоровый образ жизни или близкий к нему';
    } else if (score >= 24) {
      return 'жители психоневрологических интернатов не ведут здоровый образ жизни или близкий к нему';
    }
  }
  
  // Блок 4: "Уход за полостью рта у лиц, находящихся в отделении милосердия"
  if (testNumber === 4) {
    if (score >= 4 && score <= 8) {
      return 'высокий уровень ухода за полостью рта у лиц, находящихся в отделении милосердия';
    } else if (score >= 9 && score <= 13) {
      return 'удовлетворительный уровень ухода за полостью рта у лиц, находящихся в отделении милосердия';
    } else if (score >= 14) {
      return 'низкий уровень ухода за полостью рта у лиц, находящихся в отделении милосердия';
    }
  }
  
  return 'Нет данных';
}

async function exportToCSV(results) {
  const headers = [
    'ID',
    'Имя',
    'Фамилия',
    'Дата',
    'Общий балл',
    'Тест 1 балл',
    'Тест 1 результат',
    'Тест 2 балл',
    'Тест 2 результат',
    'Тест 3 балл',
    'Тест 3 результат',
    'Тест 4 балл',
    'Тест 4 результат'
  ].join(',') + '\n';

  const rows = results.map(result => [
    result.id,
    result.first_name,
    result.last_name,
    new Date(result.created_at).toLocaleString(),
    result.total_score,
    result.test1_score,
    `"${result.test1_result}"`,
    result.test2_score,
    `"${result.test2_result}"`,
    result.test3_score,
    `"${result.test3_result}"`,
    result.test4_score,
    `"${result.test4_result}"`
  ].join(','));

  return headers + rows.join('\n');
}

async function exportToExcel(results) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Результаты тестов');

  // Заголовки
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Имя', key: 'first_name', width: 20 },
    { header: 'Фамилия', key: 'last_name', width: 20 },
    { header: 'Дата', key: 'created_at', width: 20 },
    { header: 'Общий балл', key: 'total_score', width: 15 },
    { header: 'Тест 1 балл', key: 'test1_score', width: 15 },
    { header: 'Тест 1 результат', key: 'test1_result', width: 30 },
    { header: 'Тест 2 балл', key: 'test2_score', width: 15 },
    { header: 'Тест 2 результат', key: 'test2_result', width: 30 },
    { header: 'Тест 3 балл', key: 'test3_score', width: 15 },
    { header: 'Тест 3 результат', key: 'test3_result', width: 30 },
    { header: 'Тест 4 балл', key: 'test4_score', width: 15 },
    { header: 'Тест 4 результат', key: 'test4_result', width: 30 }
  ];

  // Стили для заголовков
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  };

  // Добавляем данные
  for (const result of results) {
    worksheet.addRow({
      id: result.id,
      first_name: result.first_name,
      last_name: result.last_name,
      created_at: new Date(result.created_at).toLocaleString(),
      total_score: result.total_score,
      test1_score: result.test1_score,
      test1_result: result.test1_result,
      test2_score: result.test2_score,
      test2_result: result.test2_result,
      test3_score: result.test3_score,
      test3_result: result.test3_result,
      test4_score: result.test4_score,
      test4_result: result.test4_result
    });
  }

  // Автоподбор ширины колонок
  worksheet.columns.forEach(column => {
    column.width = Math.max(column.width || 10, 10);
  });

  // Возвращаем буфер с Excel файлом
  return await workbook.xlsx.writeBuffer();
}

// Secret key for JWT
const JWT_SECRET = 'your-secret-key-here';
const ADMIN_PASSWORD = 'admin123'; // Change this to a secure password

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

app.get('/api/questions', (req, res) => {
  try {
    res.json(quizData);
  } catch (error) {
    console.error('Error serving quiz data:', error);
    res.status(500).json({ error: 'Failed to serve quiz data' });
  }
});

app.post('/api/results', async (req, res) => {
  try {
    const { firstName, lastName, totalScore, sectionScores, detailedAnswers } = req.body;

    // Calculate test results for each section
    const test1Score = sectionScores[0]?.score || 0;
    const test2Score = sectionScores[1]?.score || 0;
    const test3Score = sectionScores[2]?.score || 0;
    const test4Score = sectionScores[3]?.score || 0;

    const test1Result = calculateTestResult(1, test1Score);
    const test2Result = calculateTestResult(2, test2Score);
    const test3Result = calculateTestResult(3, test3Score);
    const test4Result = calculateTestResult(4, test4Score);

    // Insert main result
    const insertResult = db.prepare('INSERT INTO quiz_results (first_name, last_name, total_score, test1_score, test2_score, test3_score, test4_score, test1_result, test2_result, test3_result, test4_result) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const result = insertResult.run(firstName, lastName, totalScore, test1Score, test2Score, test3Score, test4Score, test1Result, test2Result, test3Result, test4Result);

    const resultId = result.lastInsertRowid;

    // Insert section scores with results
    const insertSectionScore = db.prepare('INSERT INTO section_scores (result_id, section_title, score, max_score, section_result) VALUES (?, ?, ?, ?, ?)');
    for (let i = 0; i < sectionScores.length; i++) {
      const section = sectionScores[i];
      const sectionResult = calculateTestResult(i + 1, section.score);
      insertSectionScore.run(resultId, section.section_title, section.score, section.max_score, sectionResult);
    }

    // Insert detailed answers
    const insertDetailedAnswer = db.prepare('INSERT INTO detailed_answers (result_id, section_title, question_id, question_text, answer_text, answer_index, possible_score, score) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    for (const answer of detailedAnswers) {
      insertDetailedAnswer.run(resultId, answer.section_title, answer.question_id, answer.question_text, answer.answer_text, answer.answer_index, answer.possible_score, answer.score);
    }

    res.json({ 
      success: true, 
      resultId,
      testResults: [test1Result, test2Result, test3Result, test4Result],
      testScores: [test1Score, test2Score, test3Score, test4Score]
    });
  } catch (error) {
    console.error('Error saving results:', error);
    res.status(500).json({ error: 'Failed to save results' });
  }
});

app.post('/api/results/excel', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    let query = `
      SELECT * FROM quiz_results 
      WHERE 1=1
    `;
    const params = [];

    if (startDate) {
      query += ` AND created_at >= ?`;
      params.push(startDate);
    }
    if (endDate) {
      query += ` AND created_at <= ?`;
      params.push(endDate);
    }
    query += ` ORDER BY created_at DESC`;

    // Get all results within date range
    const results = db.prepare(query).all(...params);

    // Get section scores and detailed answers for each result
    const detailedResults = await Promise.all(results.map(async (result) => {
      const sectionScores = db.prepare('SELECT * FROM section_scores WHERE result_id = ? ORDER BY section_title').all(result.id);
      const answers = db.prepare('SELECT * FROM detailed_answers WHERE result_id = ? ORDER BY section_title, question_id').all(result.id);
      
      return {
        ...result,
        sectionScores,
        answers
      };
    }));

    // Removed ExcelJS usage
    res.json({ success: true });
  } catch (error) {
    console.error('Error exporting results:', error);
    res.status(500).json({ error: 'Failed to export results' });
  }
});

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

app.get('/api/results', authenticateToken, async (req, res) => {
  try {
    const results = db.prepare('SELECT * FROM quiz_results ORDER BY created_at DESC').all();
    const fullResults = await Promise.all(results.map(async (result) => {
      const sectionScores = db.prepare('SELECT * FROM section_scores WHERE result_id = ?').all(result.id);
      const detailedAnswers = db.prepare('SELECT * FROM detailed_answers WHERE result_id = ?').all(result.id);
      
      return {
        ...result,
        sectionScores,
        detailedAnswers
      };
    }));

    res.json(fullResults);
  } catch (error) {
    console.error('Error getting results:', error);
    res.status(500).json({ error: 'Failed to get results' });
  }
});

app.get('/api/results/csv', authenticateToken, async (req, res) => {
  try {
    const { from, to, name } = req.query;
    let query = `
      SELECT * FROM quiz_results 
      WHERE 1=1
    `;
    const params = [];

    if (from) {
      query += ` AND DATE(created_at) >= DATE(?)`;
      params.push(from);
    }
    if (to) {
      query += ` AND DATE(created_at) <= DATE(?)`;
      params.push(to);
    }
    if (name) {
      query += ` AND (first_name LIKE ? OR last_name LIKE ?)`;
      params.push(`%${name}%`, `%${name}%`);
    }
    query += ` ORDER BY created_at DESC`;

    const results = db.prepare(query).all(...params);
    const csvContent = await exportToCSV(results);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=test_results.csv');
    res.send(csvContent);
  } catch (error) {
    console.error('Error exporting results:', error);
    res.status(500).json({ error: 'Failed to export results' });
  }
});

app.get('/api/results/excel', authenticateToken, async (req, res) => {
  try {
    const { from, to, name } = req.query;
    let query = `
      SELECT * FROM quiz_results 
      WHERE 1=1
    `;
    const params = [];

    if (from) {
      query += ` AND DATE(created_at) >= DATE(?)`;
      params.push(from);
    }
    if (to) {
      query += ` AND DATE(created_at) <= DATE(?)`;
      params.push(to);
    }
    if (name) {
      query += ` AND (first_name LIKE ? OR last_name LIKE ?)`;
      params.push(`%${name}%`, `%${name}%`);
    }
    query += ` ORDER BY created_at DESC`;

    const results = db.prepare(query).all(...params);
    const excelBuffer = await exportToExcel(results);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=test_results.xlsx');
    res.send(Buffer.from(excelBuffer));
  } catch (error) {
    console.error('Error exporting results:', error);
    res.status(500).json({ error: 'Failed to export results' });
  }
});

// Delete result endpoint
app.delete('/api/results/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    
    // Начинаем транзакцию
    const transaction = db.transaction(() => {
      // Удаляем связанные записи из section_scores
      db.prepare('DELETE FROM section_scores WHERE result_id = ?').run(id);
      
      // Удаляем основную запись
      const result = db.prepare('DELETE FROM quiz_results WHERE id = ?').run(id);
      
      if (result.changes === 0) {
        throw new Error('Result not found');
      }
    });

    transaction();
    res.json({ message: 'Result deleted successfully' });
  } catch (error) {
    console.error('Error deleting result:', error);
    res.status(500).json({ error: 'Failed to delete result' });
  }
});

app.delete('/api/results', authenticateToken, (req, res) => {
  try {
    db.exec('BEGIN TRANSACTION');
    db.exec('DELETE FROM section_scores');
    db.exec('DELETE FROM detailed_answers');
    db.exec('DELETE FROM quiz_results');
    db.exec('COMMIT');
    
    res.json({ success: true });
  } catch (error) {
    db.exec('ROLLBACK');
    console.error('Error deleting all results:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin endpoint to initialize database
app.post('/api/admin/init-db', authenticateToken, async (req, res) => {
  try {
    await initializeDatabase();
    res.json({ success: true, message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({ error: 'Failed to initialize database' });
  }
});

// Сброс базы данных (опасная зона)
app.post('/api/admin/reset-database', authenticateToken, (req, res) => {
  try {
    // Начинаем транзакцию
    const transaction = db.transaction(() => {
      // Удаляем все записи из section_scores
      db.prepare('DELETE FROM section_scores').run();
      
      // Удаляем все записи из quiz_results
      db.prepare('DELETE FROM quiz_results').run();
      
      // Сбрасываем автоинкремент
      db.prepare('DELETE FROM sqlite_sequence WHERE name IN (?, ?)').run('quiz_results', 'section_scores');
    });

    transaction();
    res.json({ message: 'Database reset successfully' });
  } catch (error) {
    console.error('Error resetting database:', error);
    res.status(500).json({ error: 'Failed to reset database' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Give time for logs to be written
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Give time for logs to be written
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received. Closing HTTP server...');
  server.close(() => {
    console.info('HTTP server closed');
    process.exit(0);
  });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
