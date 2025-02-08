const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const ExcelJS = require('exceljs');

const app = express();

// Environment variables and configuration
const isDevelopment = process.env.NODE_ENV === 'development';
const PORT = process.env.PORT || 3002;

// Development and Production configurations
const CONFIG = {
  development: {
    allowedOrigins: ['http://localhost:5173', 'http://localhost:3000'],
    databasePath: path.join(__dirname, 'data', 'quiz-data.json'),
    verbose: true
  },
  production: {
    allowedOrigins: ['http://stomtest.nsmu.ru', 'https://stomtest.nsmu.ru'],
    databasePath: path.join(__dirname, 'data', 'quiz-data.json'),
    verbose: false
  }
};

// Get current configuration
const currentConfig = isDevelopment ? CONFIG.development : CONFIG.production;

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://stomtest.nsmu.ru',
  'https://stomtest.nsmu.ru'
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// Enable pre-flight requests for all routes
app.options('*', cors());

app.use(express.json());

// Логирование всех запросов (только в development)
if (isDevelopment) {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
  });
}

// Load quiz data from JSON file
let quizData;
try {
  const quizDataPath = currentConfig.databasePath;
  console.log('Loading quiz data from:', quizDataPath);
  
  if (!fs.existsSync(quizDataPath)) {
    console.error('Quiz data file not found:', quizDataPath);
    throw new Error('Quiz data file not found');
  }
  
  const fileContent = fs.readFileSync(quizDataPath, 'utf8');
  if (isDevelopment) {
    console.log('Quiz data file content length:', fileContent.length);
  }
  
  quizData = JSON.parse(fileContent);
  console.log('Quiz data loaded successfully. Number of sections:', quizData.length);
} catch (error) {
  console.error('Error loading quiz data:', error);
  quizData = [];
}

// Initialize database
const dbPath = path.join(__dirname, 'data', 'quiz.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath, { verbose: console.log });

// Database initialization
function initializeDatabase() {
  try {
    // Enable foreign keys
    db.pragma('foreign_keys = ON');

    // Drop existing tables in reverse order of dependencies
    db.exec('DROP TABLE IF EXISTS detailed_answers');
    db.exec('DROP TABLE IF EXISTS section_scores');
    db.exec('DROP TABLE IF EXISTS quiz_results');

    // Create tables with proper foreign key constraints
    db.exec(`
      CREATE TABLE quiz_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT,
        last_name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        total_score INTEGER
      );

      CREATE TABLE section_scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        result_id INTEGER,
        section_name TEXT,
        score INTEGER,
        FOREIGN KEY (result_id) REFERENCES quiz_results(id) ON DELETE CASCADE
      );

      CREATE TABLE detailed_answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        result_id INTEGER,
        question_id INTEGER,
        question_text TEXT,
        answer_text TEXT,
        answer_index INTEGER,
        possible_score INTEGER,
        score INTEGER,
        FOREIGN KEY (result_id) REFERENCES quiz_results(id) ON DELETE CASCADE
      );
    `);
    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Initialize database tables - only called from admin panel
async function initializeDatabaseTables() {
  try {
    console.log('Reinitializing database...');
    initializeDatabase();
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
  // Headers
  const headers = [
    'ID',
    'Фамилия',
    'Имя',
    'Дата',
    // Block 1
    'Блок 1 (балл)',
    'Блок 1 (результат)',
    'Вопрос 1.1',
    'Ответ 1.1',
    'Балл 1.1',
    'Вопрос 1.2',
    'Ответ 1.2',
    'Балл 1.2',
    'Вопрос 1.3',
    'Ответ 1.3',
    'Балл 1.3',
    'Вопрос 1.4',
    'Ответ 1.4',
    'Балл 1.4',
    'Вопрос 1.5',
    'Ответ 1.5',
    'Балл 1.5',
    // Block 2
    'Блок 2 (балл)',
    'Блок 2 (результат)',
    'Вопрос 2.1',
    'Ответ 2.1',
    'Балл 2.1',
    'Вопрос 2.2',
    'Ответ 2.2',
    'Балл 2.2',
    'Вопрос 2.3',
    'Ответ 2.3',
    'Балл 2.3',
    'Вопрос 2.4',
    'Ответ 2.4',
    'Балл 2.4',
    'Вопрос 2.5',
    'Ответ 2.5',
    'Балл 2.5',
    // Block 3
    'Блок 3 (балл)',
    'Блок 3 (результат)',
    'Вопрос 3.1',
    'Ответ 3.1',
    'Балл 3.1',
    'Вопрос 3.2',
    'Ответ 3.2',
    'Балл 3.2',
    'Вопрос 3.3',
    'Ответ 3.3',
    'Балл 3.3',
    'Вопрос 3.4',
    'Ответ 3.4',
    'Балл 3.4',
    'Вопрос 3.5',
    'Ответ 3.5',
    'Балл 3.5',
    // Block 4
    'Блок 4 (балл)',
    'Блок 4 (результат)',
    'Вопрос 4.1',
    'Ответ 4.1',
    'Балл 4.1',
    'Вопрос 4.2',
    'Ответ 4.2',
    'Балл 4.2',
    'Вопрос 4.3',
    'Ответ 4.3',
    'Балл 4.3',
    'Вопрос 4.4',
    'Ответ 4.4',
    'Балл 4.4',
    'Вопрос 4.5',
    'Ответ 4.5',
    'Балл 4.5',
    // Total
    'Общий балл'
  ].join(',') + '\n';

  // Convert results to rows
  const rows = results.map(result => {
    const sectionScores = result.section_scores || {};
    const totalScore = result.total_score || 0;
    const detailedAnswers = result.detailed_answers || [];

    // Group answers by block
    const answersByBlock = {};
    detailedAnswers.forEach(answer => {
      const blockNumber = Math.floor(answer.question_id / 5) + 1;
      const questionInBlock = (answer.question_id % 5) + 1;
      if (!answersByBlock[blockNumber]) {
        answersByBlock[blockNumber] = {};
      }
      answersByBlock[blockNumber][questionInBlock] = answer;
    });

    // Build row data
    const rowData = [
      result.id,
      result.last_name,
      result.first_name,
      result.created_at
    ];

    // Add data for each block
    [1, 2, 3, 4].forEach(blockNum => {
      const blockScore = sectionScores[`Блок ${blockNum}`] || 0;
      const blockResult = calculateTestResult(blockNum, blockScore);
      
      // Add block score and result
      rowData.push(blockScore, blockResult);

      // Add questions and answers for this block
      [1, 2, 3, 4, 5].forEach(questionNum => {
        const answer = answersByBlock[blockNum]?.[questionNum] || {};
        rowData.push(
          answer.question || '',
          answer.answer || '',
          answer.score || 0
        );
      });
    });

    // Add total score
    rowData.push(totalScore);

    return rowData.join(',');
  });

  return headers + rows.join('\n');
}

async function exportToExcel(results) {
  try {
    console.log('Starting Excel export with', results.length, 'results');
    
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'StomatQuiz';
    workbook.lastModifiedBy = 'StomatQuiz';
    workbook.created = new Date();
    workbook.modified = new Date();
    
    // Summary worksheet
    const summarySheet = workbook.addWorksheet('Общие результаты', {
      properties: { tabColor: { argb: 'FF00BFFF' } }
    });

    // Define columns
    const columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Фамилия', key: 'lastName', width: 20 },
      { header: 'Имя', key: 'firstName', width: 20 },
      { header: 'Дата', key: 'date', width: 20 }
    ];

    // Add columns for each block
    [1, 2, 3, 4].forEach(blockNum => {
      columns.push(
        { header: `Блок ${blockNum} (балл)`, key: `block${blockNum}Score`, width: 15 },
        { header: `Блок ${blockNum} (результат)`, key: `block${blockNum}Result`, width: 20 }
      );
      
      // Add columns for questions in this block
      [1, 2, 3, 4, 5].forEach(questionNum => {
        columns.push(
          { header: `Вопрос ${blockNum}.${questionNum}`, key: `q${blockNum}_${questionNum}`, width: 40 },
          { header: `Ответ ${blockNum}.${questionNum}`, key: `a${blockNum}_${questionNum}`, width: 40 },
          { header: `Балл ${blockNum}.${questionNum}`, key: `s${blockNum}_${questionNum}`, width: 15 }
        );
      });
    });

    // Add total score column
    columns.push({ header: 'Общий балл', key: 'totalScore', width: 15 });

    summarySheet.columns = columns;

    // Style the headers
    const headerRow = summarySheet.getRow(1);
    headerRow.font = { bold: true, size: 12 };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6F0FF' }
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

    // Add data rows
    results.forEach((result, index) => {
      const sectionScores = result.section_scores || {};
      const totalScore = result.total_score || 0;
      const detailedAnswers = result.detailed_answers || [];

      // Group answers by block
      const answersByBlock = {};
      detailedAnswers.forEach(answer => {
        const blockNumber = Math.floor(answer.question_id / 5) + 1;
        const questionInBlock = (answer.question_id % 5) + 1;
        if (!answersByBlock[blockNumber]) {
          answersByBlock[blockNumber] = {};
        }
        answersByBlock[blockNumber][questionInBlock] = answer;
      });

      // Prepare row data
      const rowData = {
        id: result.id,
        lastName: result.last_name,
        firstName: result.first_name,
        date: result.created_at,
        totalScore: totalScore
      };

      // Add data for each block
      [1, 2, 3, 4].forEach(blockNum => {
        const blockScore = sectionScores[`Блок ${blockNum}`] || 0;
        const blockResult = calculateTestResult(blockNum, blockScore);
        
        rowData[`block${blockNum}Score`] = blockScore;
        rowData[`block${blockNum}Result`] = blockResult;

        // Add questions and answers for this block
        [1, 2, 3, 4, 5].forEach(questionNum => {
          const answer = answersByBlock[blockNum]?.[questionNum] || {};
          rowData[`q${blockNum}_${questionNum}`] = answer.question || '';
          rowData[`a${blockNum}_${questionNum}`] = answer.answer || '';
          rowData[`s${blockNum}_${questionNum}`] = answer.score || 0;
        });
      });

      const row = summarySheet.addRow(rowData);

      // Style the row
      row.alignment = { vertical: 'middle', wrapText: true };
      if ((index + 2) % 2 === 0) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF8F8F8' }
        };
      }

      // Format score cells
      row.eachCell((cell, colNumber) => {
        const column = columns[colNumber - 1];
        if (column.key.startsWith('block') && column.key.endsWith('Score') ||
            column.key.startsWith('s') ||
            column.key === 'totalScore') {
          cell.numFmt = '0.00';
          cell.alignment = { horizontal: 'center' };
        } else if (column.key.endsWith('Result')) {
          cell.alignment = { horizontal: 'center' };
        }
      });
    });

    // Add borders
    summarySheet.eachRow(row => {
      row.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Freeze header row and enable filters
    summarySheet.views = [
      { 
        state: 'frozen', 
        xSplit: 0, 
        ySplit: 1, 
        activeCell: 'A2',
        showRowColHeaders: true,
        filterButton: true
      }
    ];

    console.log('Generating Excel buffer...');
    const buffer = await workbook.xlsx.writeBuffer();
    console.log('Excel buffer generated, size:', buffer.length, 'bytes');
    return buffer;
  } catch (error) {
    console.error('Error in exportToExcel:', error);
    throw error;
  }
}

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
  console.log('Login attempt:', req.body);
  console.log('Headers:', req.headers);
  
  const { password } = req.body;

  if (password === 'admin123') {
    console.log('Login successful');
    const token = jwt.sign({ role: 'admin' }, 'your-secret-key-here', { expiresIn: '1h' });
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

  jwt.verify(token, 'your-secret-key-here', (err, user) => {
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
    if (!quizData || !Array.isArray(quizData) || quizData.length === 0) {
      console.error('Quiz data is not properly loaded');
      return res.status(500).json({ error: 'Quiz data is not available' });
    }
    
    console.log('Sending quiz data. Number of sections:', quizData.length);
    res.json(quizData);
  } catch (error) {
    console.error('Error sending quiz data:', error);
    res.status(500).json({ error: 'Failed to retrieve quiz data' });
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
    const insertDetailedAnswer = db.prepare('INSERT INTO detailed_answers (result_id, question_id, question_text, answer_text, answer_index, possible_score, score) VALUES (?, ?, ?, ?, ?, ?, ?)');
    for (const answer of detailedAnswers) {
      insertDetailedAnswer.run(resultId, answer.question_id, answer.question_text, answer.answer_text, answer.answer_index, answer.possible_score, answer.score);
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
    console.log('Reinitializing database...');
    
    // Close existing connections
    db.exec('BEGIN TRANSACTION');
    
    // Drop existing tables
    db.exec(`
      DROP TABLE IF EXISTS detailed_answers;
      DROP TABLE IF EXISTS section_scores;
      DROP TABLE IF EXISTS quiz_results;
    `);
    
    // Recreate tables
    db.exec(`
      CREATE TABLE quiz_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT,
        last_name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        total_score REAL
      );

      CREATE TABLE section_scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        result_id INTEGER,
        section_number INTEGER,
        score REAL,
        FOREIGN KEY (result_id) REFERENCES quiz_results(id) ON DELETE CASCADE
      );

      CREATE TABLE detailed_answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        result_id INTEGER,
        question_id INTEGER,
        question_text TEXT,
        answer_text TEXT,
        answer_index INTEGER,
        possible_score INTEGER,
        score INTEGER,
        FOREIGN KEY (result_id) REFERENCES quiz_results(id) ON DELETE CASCADE
      );
    `);
    
    db.exec('COMMIT');
    console.log('Database reinitialized successfully');
    
    return res.json({ message: 'Database reinitialized successfully' });
  } catch (error) {
    console.error('Error reinitializing database:', error);
    db.exec('ROLLBACK');
    return res.status(500).json({ error: error.message });
  }
});

// Reset database endpoint
app.post('/api/admin/reset-database', authenticateToken, async (req, res) => {
  try {
    console.log('Resetting database...');
    
    db.exec('BEGIN TRANSACTION');
    db.exec('DELETE FROM section_scores');
    db.exec('DELETE FROM detailed_answers');
    db.exec('DELETE FROM quiz_results');
    db.exec('COMMIT');
    
    console.log('Database reset successfully');
    return res.json({ message: 'Database reset successfully' });
  } catch (error) {
    console.error('Error resetting database:', error);
    db.exec('ROLLBACK');
    return res.status(500).json({ error: error.message });
  }
});

// Delete result endpoint
app.delete('/api/results/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if result exists
    const result = db.prepare('SELECT id FROM quiz_results WHERE id = ?').get(id);
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }

    // Enable foreign key support
    db.pragma('foreign_keys = ON');

    // Delete result (related records will be deleted automatically due to ON DELETE CASCADE)
    const deleteStmt = db.prepare('DELETE FROM quiz_results WHERE id = ?');
    const info = deleteStmt.run(id);

    if (info.changes === 0) {
      return res.status(404).json({ error: 'Result not found' });
    }

    return res.json({ message: 'Result deleted successfully' });
  } catch (error) {
    console.error('Error in delete operation:', error);
    return res.status(500).json({ 
      error: 'Failed to delete result',
      details: error.message 
    });
  }
});

app.delete('/api/results', authenticateToken, async (req, res) => {
  try {
    db.exec('BEGIN TRANSACTION');
    db.exec('DELETE FROM section_scores');
    db.exec('DELETE FROM detailed_answers');
    db.exec('DELETE FROM quiz_results');
    db.exec('COMMIT');
    
    return res.json({ message: 'All results deleted successfully' });
  } catch (error) {
    db.exec('ROLLBACK');
    console.error('Error deleting all results:', error);
    return res.status(500).json({ error: error.message });
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
    SELECT 
      r.*,
      GROUP_CONCAT(DISTINCT s.section_name || ':' || s.score) as section_scores,
      GROUP_CONCAT(
        d.question_id || '|' || 
        d.question_text || '|' || 
        d.answer_text || '|' || 
        d.answer_index || '|' || 
        d.possible_score || '|' || 
        d.score,
        ';;'
      ) as detailed_answers
    FROM quiz_results r
    LEFT JOIN section_scores s ON r.id = s.result_id
    LEFT JOIN detailed_answers d ON r.id = d.result_id
    WHERE 1=1
  `;
  const params = [];

  if (from) {
    query += ` AND DATE(r.created_at) >= DATE(?)`;
    params.push(from);
  }
  if (to) {
    query += ` AND DATE(r.created_at) <= DATE(?)`;
    params.push(to);
  }
  if (name) {
    query += ` AND (r.first_name LIKE ? OR r.last_name LIKE ?)`;
    params.push(`%${name}%`, `%${name}%`);
  }
  query += ` GROUP BY r.id ORDER BY r.created_at DESC`;

  const results = db.prepare(query).all(...params);
  return results.map(result => {
    // Parse section scores
    const sectionScores = {};
    if (result.section_scores) {
      result.section_scores.split(',').forEach(score => {
        const [name, value] = score.split(':');
        sectionScores[name] = parseFloat(value);
      });
    }

    // Parse detailed answers
    const detailedAnswers = [];
    if (result.detailed_answers) {
      result.detailed_answers.split(';;').forEach(answer => {
        if (!answer) return;
        const [questionId, questionText, answerText, answerIndex, possibleScore, score] = answer.split('|');
        detailedAnswers.push({
          question_id: parseInt(questionId),
          question: questionText,
          answer: answerText,
          answer_index: parseInt(answerIndex),
          possible_score: parseFloat(possibleScore),
          score: parseFloat(score)
        });
      });
    }

    // Sort detailed answers by question_id to maintain order
    detailedAnswers.sort((a, b) => a.question_id - b.question_id);

    return {
      ...result,
      created_at: formatDate(result.created_at),
      section_scores: sectionScores,
      detailed_answers: detailedAnswers
    };
  });
}

app.get('/api/results', authenticateToken, async (req, res) => {
  try {
    const { from, to, name, format } = req.query;
    const results = getFilteredResults(from, to, name);

    if (format === 'csv') {
      const csvData = exportToCSV(results);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="test_results.csv"');
      return res.send(csvData);
    } 
    
    if (format === 'excel') {
      try {
        const buffer = await exportToExcel(results);
        if (!buffer || buffer.length === 0) {
          throw new Error('Generated Excel buffer is empty');
        }
        console.log('Excel buffer size:', buffer.length, 'bytes');
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="test_results.xlsx"');
        res.setHeader('Content-Length', buffer.length);
        return res.end(buffer);
      } catch (excelError) {
        console.error('Error generating Excel:', excelError);
        return res.status(500).json({ error: 'Failed to generate Excel file' });
      }
    }
    
    return res.json(results);
  } catch (error) {
    console.error('Error getting results:', error);
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/results/csv', authenticateToken, async (req, res) => {
  try {
    const { from, to, name } = req.query;
    const results = getFilteredResults(from, to, name);
    const csvContent = await exportToCSV(results);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="test_results.csv"');
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
    res.setHeader('Content-Disposition', 'attachment; filename="test_results.xlsx"');
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

// Start server
app.listen(PORT, () => {
  // Initialize database when server starts
  initializeDatabase();
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`CORS enabled for origins: ${allowedOrigins.join(', ')}`);
  console.log('Database initialized');
});
