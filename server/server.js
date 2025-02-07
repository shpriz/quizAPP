const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const ExcelJS = require('exceljs');

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'http://stomtest.nsmu.ru:3000',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

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

// Database initialization
function initializeDatabase() {
  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Create tables with proper foreign key constraints
  db.exec(`
    CREATE TABLE IF NOT EXISTS quiz_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT,
      last_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      total_score INTEGER
    );

    CREATE TABLE IF NOT EXISTS section_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      result_id INTEGER,
      section_name TEXT,
      score INTEGER,
      FOREIGN KEY (result_id) REFERENCES quiz_results(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS detailed_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      result_id INTEGER,
      question_id TEXT,
      answer TEXT,
      is_correct BOOLEAN,
      FOREIGN KEY (result_id) REFERENCES quiz_results(id) ON DELETE CASCADE
    );
  `);
}

// Initialize database tables - only called from admin panel
async function initializeDatabaseTables() {
  try {
    // Drop existing tables
    db.exec('DROP TABLE IF EXISTS detailed_answers');
    db.exec('DROP TABLE IF EXISTS section_scores');
    db.exec('DROP TABLE IF EXISTS quiz_results');

    // Create tables with updated schema
    db.exec(`
      CREATE TABLE IF NOT EXISTS quiz_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT,
        last_name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        total_score INTEGER
      );

      CREATE TABLE IF NOT EXISTS section_scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        result_id INTEGER,
        section_name TEXT,
        score INTEGER,
        FOREIGN KEY (result_id) REFERENCES quiz_results(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS detailed_answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        result_id INTEGER,
        question_id TEXT,
        answer TEXT,
        is_correct BOOLEAN,
        FOREIGN KEY (result_id) REFERENCES quiz_results(id) ON DELETE CASCADE
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

// Environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = 'admin123';
const JWT_SECRET = 'your-secret-key-here';

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
  console.log('Login attempt:', req.body);
  console.log('Headers:', req.headers);
  
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    console.log('Login successful');
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    console.log('Login failed: invalid password');
    res.status(401).json({ error: 'Invalid password' });
  }
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  console.log('Authenticating request to:', req.path);
  console.log('Auth headers:', req.headers.authorization);
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Token verification failed:', err.message);
      return res.status(403).json({ error: 'Invalid token' });
    }
    console.log('Token verified for user:', user);
    req.user = user;
    next();
  });
}

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
    const insertResult = db.prepare('INSERT INTO quiz_results (first_name, last_name, total_score) VALUES (?, ?, ?)');
    const result = insertResult.run(firstName, lastName, totalScore);

    const resultId = result.lastInsertRowid;

    // Insert section scores with results
    const insertSectionScore = db.prepare('INSERT INTO section_scores (result_id, section_name, score) VALUES (?, ?, ?)');
    for (let i = 0; i < sectionScores.length; i++) {
      const section = sectionScores[i];
      const sectionResult = calculateTestResult(i + 1, section.score);
      insertSectionScore.run(resultId, section.section_name, section.score);
    }

    // Insert detailed answers
    const insertDetailedAnswer = db.prepare('INSERT INTO detailed_answers (result_id, question_id, answer, is_correct) VALUES (?, ?, ?, ?)');
    for (const answer of detailedAnswers) {
      insertDetailedAnswer.run(resultId, answer.question_id, answer.answer, answer.is_correct);
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
      const sectionScores = db.prepare('SELECT * FROM section_scores WHERE result_id = ? ORDER BY section_name').all(result.id);
      const answers = db.prepare('SELECT * FROM detailed_answers WHERE result_id = ? ORDER BY question_id').all(result.id);
      
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

// Admin endpoint to initialize database tables
app.post('/api/admin/init-db-tables', authenticateToken, async (req, res) => {
  try {
    await initializeDatabaseTables();
    res.json({ success: true, message: 'Database tables initialized successfully' });
  } catch (error) {
    console.error('Error initializing database tables:', error);
    res.status(500).json({ error: 'Failed to initialize database tables' });
  }
});

// Reinitialize database endpoint
app.post('/api/admin/reinit-db', authenticateToken, async (req, res) => {
  try {
    // Drop existing tables
    db.exec('DROP TABLE IF EXISTS detailed_answers');
    db.exec('DROP TABLE IF EXISTS section_scores');
    db.exec('DROP TABLE IF EXISTS quiz_results');

    // Initialize with new schema
    initializeDatabase();
    
    res.json({ message: 'Database reinitialized successfully' });
  } catch (error) {
    console.error('Error reinitializing database:', error);
    res.status(500).json({ 
      error: 'Failed to reinitialize database',
      details: error.message 
    });
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

// Delete result endpoint
app.delete('/api/results/:id', authenticateToken, (req, res) => {
  console.log('Deleting result with id:', req.params.id);
  
  try {
    const { id } = req.params;
    
    // Проверяем существование результата
    const result = db.prepare('SELECT id FROM quiz_results WHERE id = ?').get(id);
    if (!result) {
      console.log('Result not found:', id);
      return res.status(404).json({ error: 'Result not found' });
    }

    // Включаем поддержку внешних ключей
    db.pragma('foreign_keys = ON');

    // Удаляем результат (связанные записи удалятся автоматически благодаря ON DELETE CASCADE)
    const deleteStmt = db.prepare('DELETE FROM quiz_results WHERE id = ?');
    const info = deleteStmt.run(id);
    
    console.log('Delete operation result:', info);

    if (info.changes === 0) {
      console.log('No rows were deleted');
      return res.status(404).json({ error: 'Result not found' });
    }

    console.log('Successfully deleted result:', id);
    res.json({ message: 'Result deleted successfully' });
  } catch (error) {
    console.error('Error in delete operation:', error);
    res.status(500).json({ 
      error: 'Failed to delete result',
      details: error.message 
    });
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

// Форматирование даты
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Получение отфильтрованных результатов
function getFilteredResults(from, to, name) {
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
  return results.map(result => ({
    ...result,
    created_at: formatDate(result.created_at)
  }));
}

app.get('/api/results', authenticateToken, (req, res) => {
  try {
    const { from, to, name, format } = req.query;
    const results = getFilteredResults(from, to, name);

    if (format === 'csv') {
      const csvData = exportToCSV(results);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=results.csv');
      res.send(csvData);
    } else if (format === 'excel') {
      exportToExcel(results).then(buffer => {
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=results.xlsx');
        res.send(buffer);
      });
    } else {
      res.json(results);
    }
  } catch (error) {
    console.error('Error getting results:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/results/csv', authenticateToken, async (req, res) => {
  try {
    const { from, to, name } = req.query;
    const results = getFilteredResults(from, to, name);
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
    const results = getFilteredResults(from, to, name);
    const excelBuffer = await exportToExcel(results);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=test_results.xlsx');
    res.send(Buffer.from(excelBuffer));
  } catch (error) {
    console.error('Error exporting results:', error);
    res.status(500).json({ error: 'Failed to export results' });
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
