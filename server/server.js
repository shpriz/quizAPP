const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const ExcelJS = require('exceljs');
const { logger, requestLogger } = require('./logger');

const app = express();

// Environment variables and configuration
const isDevelopment = process.env.NODE_ENV === 'development';
const PORT = process.env.PORT || 3002;

// Development and Production configurations
const CONFIG = {
  development: {
    allowedOrigins: ['http://194.87.69.156:3000'],
    databasePath: path.join(__dirname, 'data', 'quiz-data.json'),
    verbose: true
  },
  production: {
    allowedOrigins: ['http://194.87.69.156:3000'],
    databasePath: path.join(__dirname, 'data', 'quiz-data.json'),
    verbose: false
  }
};

// Get current configuration
const currentConfig = isDevelopment ? CONFIG.development : CONFIG.production;

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || currentConfig.allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Enable pre-flight requests for all routes
app.options('*', cors());

app.use(express.json());
app.use(requestLogger);  // Add request logging middleware

// Логирование всех запросов (только в development)
if (isDevelopment) {
  app.use((req, next) => {
    logger.info(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
  });
}

// Load quiz data from JSON file
let quizData;
try {
  const quizDataPath = currentConfig.databasePath;
  logger.info('Loading quiz data from:', quizDataPath);
  
  if (!fs.existsSync(quizDataPath)) {
    logger.error('Quiz data file not found:', quizDataPath);
    throw new Error('Quiz data file not found');
  }
  
  const fileContent = fs.readFileSync(quizDataPath, 'utf8');
  if (isDevelopment) {
    logger.info('Quiz data file content length:', fileContent.length);
  }
  
  quizData = JSON.parse(fileContent);
  logger.info('Quiz data loaded successfully. Number of sections:', quizData.length);
} catch (error) {
  logger.error('Error loading quiz data:', error);
  quizData = [];
}

// Initialize database
const dbPath = path.join(__dirname, 'data', 'quiz.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let db;
try {
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      logger.error('Error opening database:', err);
      throw err;
    }
    logger.info('Connected to SQLite database');
    
    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON');
  });
} catch (error) {
  logger.error('Error initializing database:', error);
  throw error;
}

// Calculate overall result level based on total score
function calculateOverallResult(totalScore) {
  if (totalScore >= 99) {
    return 'Очень плохой уровень осуществления гигиены полости рта, оказания стоматологической помощи и поддержания здорового образа жизни людей, проживающих в психоневрологических интернатах, в рамках сестринского ухода';
  } else if (totalScore >= 83) {
    return 'Плохой уровень осуществления гигиены полости рта, оказания стоматологической помощи и поддержания здорового образа жизни людей, проживающих в психоневрологических интернатах, в рамках сестринского ухода';
  } else if (totalScore >= 67) {
    return 'Неудовлетворительный уровень осуществления гигиены полости рта, оказания стоматологической помощи и поддержания здорового образа жизни людей, проживающих в психоневрологических интернатах, в рамках сестринского ухода';
  } else if (totalScore >= 51) {
    return 'Удовлетворительный уровень осуществления гигиены полости рта, оказания стоматологической помощи и поддержания здорового образа жизни людей, проживающих в психоневрологических интернатах, в рамках сестринского ухода';
  } else if (totalScore >= 35) {
    return 'Высокий уровень осуществления гигиены полости рта, оказания стоматологической помощи и поддержания здорового образа жизни людей, проживающих в психоневрологических интернатах, в рамках сестринского ухода';
  } else {
    return 'Недостаточно баллов для оценки';
  }
}

// Database initialization - only called from admin panel
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    try {
      // Drop existing tables in reverse order of dependencies
      const dropTables = [
        'DROP TABLE IF EXISTS detailed_answers',
        'DROP TABLE IF EXISTS section_scores',
        'DROP TABLE IF EXISTS quiz_results'
      ];

      const createTables = `
        CREATE TABLE IF NOT EXISTS quiz_results (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          total_score REAL NOT NULL,
          overall_result TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS section_scores (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          result_id INTEGER NOT NULL,
          section_name TEXT NOT NULL,
          score REAL NOT NULL,
          FOREIGN KEY (result_id) REFERENCES quiz_results(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS detailed_answers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          result_id INTEGER NOT NULL,
          question_id INTEGER NOT NULL,
          question_text TEXT,
          answer_text TEXT,
          answer_index INTEGER,
          possible_score REAL,
          score REAL,
          FOREIGN KEY (result_id) REFERENCES quiz_results(id) ON DELETE CASCADE
        );
      `;

      db.serialize(() => {
        dropTables.forEach(sql => {
          db.run(sql);
        });
        
        db.exec(createTables, (err) => {
          if (err) {
            logger.error('Error creating tables:', err);
            reject(err);
          } else {
            logger.info('Database tables created successfully');
            resolve();
          }
        });
      });
    } catch (error) {
      logger.error('Error initializing database:', error);
      reject(error);
    }
  });
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
    'Общий балл',
    'Общий результат',

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
    'Балл 4.5'
  ].join(',') + '\n';

  // Convert results to rows
  const rows = results.map(result => {
    const sectionScores = result.section_scores || {};
    const totalScore = result.total_score || 0;
    const detailedAnswers = result.detailed_answers || [];

    // Group answers by block
    const answersByBlock = {};
    detailedAnswers.forEach(answer => {
      const blockNumber = Math.floor((answer.question_id - 1) / 5) + 1;
      const questionInBlock = ((answer.question_id - 1) % 5) + 1;
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
      result.created_at,
      totalScore,
      `"${result.overall_result || calculateOverallResult(totalScore)}"`
    ];

    // Add data for each block
    [1, 2, 3, 4].forEach(blockNum => {
      const blockScore = sectionScores[`Блок ${blockNum}`] || 0;
      const blockResult = calculateTestResult(blockNum, blockScore) || 'Нет данных';
      
      // Add block score and result
      rowData.push(blockScore, `"${blockResult}"`);

      // Add questions and answers for this block
      [1, 2, 3, 4, 5].forEach(questionNum => {
        const answer = answersByBlock[blockNum]?.[questionNum] || {};
        rowData.push(
          `"${answer.question_text || ''}"`,
          `"${answer.answer_text || ''}"`,
          answer.score || 0
        );
      });
    });

    return rowData.join(',');
  });

  return headers + rows.join('\n');
}

async function exportToExcel(results) {
  try {
    logger.info('Starting Excel export with', results.length, 'results');
    
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
      { header: 'Дата', key: 'date', width: 20 },
      { header: 'Общий балл', key: 'totalScore', width: 15 },
      { header: 'Общий результат', key: 'overallResult', width: 80 }
    ];

    // Add columns for each block
    [1, 2, 3, 4].forEach(blockNum => {
      columns.push(
        { header: `Блок ${blockNum} (балл)`, key: `block${blockNum}Score`, width: 15 },
        { header: `Блок ${blockNum} (результат)`, key: `block${blockNum}Result`, width: 60 }
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

      // Group answers by block and question
      const answersByBlock = {};
      detailedAnswers.forEach(answer => {
        const blockNumber = Math.floor((answer.question_id - 1) / 5) + 1;
        const questionInBlock = ((answer.question_id - 1) % 5) + 1;
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
        totalScore: totalScore,
        overallResult: result.overall_result || calculateOverallResult(totalScore)
      };

      // Add data for each block
      [1, 2, 3, 4].forEach(blockNum => {
        const blockScore = sectionScores[`Блок ${blockNum}`] || 0;
        const blockResult = calculateTestResult(blockNum, blockScore) || 'Нет данных';
        
        rowData[`block${blockNum}Score`] = blockScore;
        rowData[`block${blockNum}Result`] = blockResult;

        // Add questions and answers for this block
        [1, 2, 3, 4, 5].forEach(questionNum => {
          const answer = answersByBlock[blockNum]?.[questionNum] || {};
          rowData[`q${blockNum}_${questionNum}`] = answer.question_text || '';
          rowData[`a${blockNum}_${questionNum}`] = answer.answer_text || '';
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
          cell.alignment = { horizontal: 'left', wrapText: true };
          cell.font = { bold: true };
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

    logger.info('Generating Excel buffer...');
    const buffer = await workbook.xlsx.writeBuffer();
    logger.info('Excel buffer generated, size:', buffer.length, 'bytes');
    return buffer;
  } catch (error) {
    logger.error('Error in exportToExcel:', error);
    throw error;
  }
}

// Admin login endpoint
app.post('/admin/login', (req, res) => {
  logger.info('Login attempt:', req.body);
  logger.info('Headers:', req.headers);
  
  const { password } = req.body;

  if (password === 'admin123') {
    logger.info('Login successful');
    const token = jwt.sign({ role: 'admin' }, '7683968aed78db52866fb4f4174fedd2d13cbb34da4075f07bbc03bf05768ce4', { expiresIn: '1h' });
    res.json({ token });
  } else {
    logger.info('Login failed: invalid password');
    res.status(401).json({ error: 'Invalid password' });
  }
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  logger.info('Authenticating request to:', req.path);
  logger.info('Auth headers:', req.headers.authorization);
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logger.info('No token provided');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, '7683968aed78db52866fb4f4174fedd2d13cbb34da4075f07bbc03bf05768ce4', (err, user) => {
    if (err) {
      logger.info('Token verification failed:', err.message);
      return res.status(403).json({ error: 'Invalid token' });
    }
    logger.info('Token verified for user:', user);
    req.user = user;
    next();
  });
}

app.get('/questions', (req, res) => {
  try {
    if (!quizData || !Array.isArray(quizData) || quizData.length === 0) {
      logger.error('Quiz data is not properly loaded');
      return res.status(500).json({ error: 'Quiz data is not available' });
    }
    
    logger.info('Sending quiz data. Number of sections:', quizData.length);
    res.json(quizData);
  } catch (error) {
    logger.error('Error sending quiz data:', error);
    res.status(500).json({ error: 'Failed to retrieve quiz data' });
  }
});

app.post('/results', async (req, res) => {
  const { firstName, lastName, sectionScores, totalScore, detailedAnswers } = req.body;
  const overallResult = calculateOverallResult(totalScore);
  
  logger.info('Saving results:', { 
    firstName, 
    lastName, 
    totalScore,
    overallResult,
    sectionScores,
    answerCount: detailedAnswers?.length || 0
  });

  try {
    // db.serialize(() => {
    //   // Insert quiz result with overall result
    //   const resultStmt = db.prepare(`
    //     INSERT INTO quiz_results (first_name, last_name, total_score, overall_result)
    //     VALUES (?, ?, ?, ?)
    //   `);
    //   const resultInfo = resultStmt.run(firstName, lastName, totalScore, overallResult);
    //   const resultId = resultInfo.lastInsertRowid;

    //   // Insert section scores
    //   const sectionScoreStmt = db.prepare(`
    //     INSERT INTO section_scores (result_id, section_name, score)
    //     VALUES (?, ?, ?)
    //   `);

    //   // Convert section scores to proper format
    //   if (Array.isArray(sectionScores)) {
    //     sectionScores.forEach((section, index) => {
    //       if (!section || typeof section.score !== 'number') {
    //         logger.warn('Invalid section score:', section);
    //         return;
    //       }
    //       const sectionNumber = index + 1;
    //       const sectionName = `Блок ${sectionNumber}`;
    //       logger.info('Saving section score:', { sectionName, score: section.score });
    //       sectionScoreStmt.run(resultId, sectionName, section.score);
    //     });
    //   } else {
    //     logger.warn('sectionScores is not an array:', sectionScores);
    //   }

    //   // Insert detailed answers
    //   if (Array.isArray(detailedAnswers) && detailedAnswers.length > 0) {
    //     const answerStmt = db.prepare(`
    //       INSERT INTO detailed_answers (
    //         result_id, question_id, question_text, 
    //         answer_text, answer_index, possible_score, score
    //       )
    //       VALUES (?, ?, ?, ?, ?, ?, ?)
    //     `);

    //     detailedAnswers.forEach(answer => {
    //       if (!answer) {
    //         logger.warn('Invalid answer:', answer);
    //         return;
    //       }

    //       logger.info('Saving answer:', {
    //         questionId: answer.question_id,
    //         question: answer.question_text,
    //         answer: answer.answer_text,
    //         score: answer.score
    //       });

    //       answerStmt.run(
    //         resultId,
    //         answer.question_id,
    //         answer.question_text || '',
    //         answer.answer_text || '',
    //         answer.answer_index || 0,
    //         answer.possible_score || 0,
    //         answer.score || 0
    //       );
    //     });
    //   } else {
    //     logger.warn('No detailed answers provided:', detailedAnswers);
    //   }
    // });
    const resultId = await new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run(
          'INSERT INTO results (first_name, last_name, total_score, overall_result, created_at) VALUES (?, ?, ?, ?, datetime("now"))',
          [firstName, lastName, totalScore, overallResult],
          function(err) {
            if (err) reject(err);
            resolve(this.lastID);
          }
        );
      });
    });
    // Now resultId is available here
    await Promise.all([
      ...sectionScores.map(score => 
        new Promise((resolve, reject) => {
          db.run(
            'INSERT INTO section_scores (result_id, section_number, score) VALUES (?, ?, ?)',
            [resultId, score.sectionNumber, score.score],
            err => err ? reject(err) : resolve()
          );
        })
      ),
      ...detailedAnswers.map(answer => 
        new Promise((resolve, reject) => {
          db.run(
            'INSERT INTO detailed_answers (result_id, question_number, answer, is_correct) VALUES (?, ?, ?, ?)',
            [resultId, answer.questionNumber, answer.answer, answer.isCorrect],
            err => err ? reject(err) : resolve()
          );
        })
      )
    ]);

    logger.info('Results saved successfully');
    res.json({ 
      success: true, 
      message: 'Results saved successfully',
      resultId: resultId
    });

    res.json({ success: true, resultId });


  } catch (error) {
    logger.error('Error saving results:', error);
    res.status(500).json({ error: 'Failed to save results', details: error.message });
  }
});

// Получение отфильтрованных результатов
function getFilteredResults(from, to, name) {
  try {
    let query = `
      SELECT 
        r.*,
        GROUP_CONCAT(DISTINCT s.section_name || ':' || s.score) as section_scores,
        GROUP_CONCAT(
          d.question_id || '|' || 
          COALESCE(d.question_text, '') || '|' || 
          COALESCE(d.answer_text, '') || '|' || 
          COALESCE(d.answer_index, 0) || '|' || 
          COALESCE(d.possible_score, 0) || '|' || 
          COALESCE(d.score, 0),
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

    logger.info('Running query:', query, 'with params:', params);
    const results = db.all(query, params);
    
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
            question_text: questionText || '',
            answer_text: answerText || '',
            answer_index: parseInt(answerIndex) || 0,
            possible_score: parseFloat(possibleScore) || 0,
            score: parseFloat(score) || 0
          });
        });
      }

      // Sort detailed answers by question_id to maintain order
      detailedAnswers.sort((a, b) => a.question_id - b.question_id);

      return {
        id: result.id,
        first_name: result.first_name,
        last_name: result.last_name,
        created_at: result.created_at,
        total_score: result.total_score,
        overall_result: result.overall_result,
        section_scores: sectionScores,
        detailed_answers: detailedAnswers
      };
    });
  } catch (error) {
    logger.error('Error in getFilteredResults:', error);
    throw error;
  }
}

app.get('/results', authenticateToken, async (req, res) => {
  try {
    const { from, to, name, format } = req.query;
    logger.info('Getting results with params:', { from, to, name, format });
    
    const results = getFilteredResults(from, to, name);
    logger.info(`Found ${results.length} results`);

    if (format === 'csv') {
      const csvContent = await exportToCSV(results);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=results.csv');
      return res.send(csvContent);
    } else if (format === 'excel') {
      const buffer = await exportToExcel(results);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=results.xlsx');
      return res.send(buffer);
    }

    res.json(results);
  } catch (error) {
    logger.error('Error getting results:', error);
    res.status(500).json({ error: 'Failed to get results', details: error.message });
  }
});

app.get('/results/csv', authenticateToken, async (req, res) => {
  try {
    const { from, to, name } = req.query;
    const results = getFilteredResults(from, to, name);
    const csvContent = await exportToCSV(results);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="test_results.csv"');
    res.send(csvContent);
  } catch (error) {
    logger.error('Error exporting results:', error);
    res.status(500).json({ error: 'Failed to export results' });
  }
});

app.get('/results/excel', authenticateToken, async (req, res) => {
  try {
    const { from, to, name } = req.query;
    const results = getFilteredResults(from, to, name);
    const excelBuffer = await exportToExcel(results);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="test_results.xlsx"');
    res.send(Buffer.from(excelBuffer));
  } catch (error) {
    logger.error('Error exporting results:', error);
    res.status(500).json({ error: 'Failed to export results' });
  }
});

// Admin endpoint to initialize database
app.post('/admin/init-db', authenticateToken, async (req, res) => {
  try {
    await initializeDatabase();
    res.json({ success: true, message: 'Database initialized successfully' });
  } catch (error) {
    logger.error('Error initializing database:', error);
    res.status(500).json({ error: 'Failed to initialize database' });
  }
});

// Admin endpoint to initialize database tables
app.post('/admin/init-db-tables', authenticateToken, async (req, res) => {
  try {
    await initializeDatabase();
    res.json({ success: true, message: 'Database tables initialized successfully' });
  } catch (error) {
    logger.error('Error initializing database tables:', error);
    res.status(500).json({ error: 'Failed to initialize database tables' });
  }
});

// Reinitialize database endpoint
app.post('/admin/reinit-db', authenticateToken, async (req, res) => {
  try {
    logger.info('Reinitializing database...');
    
    // Start transaction
    db.serialize(() => {
      // Drop existing tables
      db.run('DROP TABLE IF EXISTS detailed_answers');
      db.run('DROP TABLE IF EXISTS section_scores');
      db.run('DROP TABLE IF EXISTS quiz_results');
      
      // Recreate tables
      db.exec(`
        CREATE TABLE quiz_results (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          first_name TEXT,
          last_name TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          total_score REAL,
          overall_result TEXT
        );

        CREATE TABLE section_scores (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          result_id INTEGER,
          section_name TEXT,
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
          possible_score REAL,
          score REAL,
          FOREIGN KEY (result_id) REFERENCES quiz_results(id) ON DELETE CASCADE
        );
      `);
    });

    logger.info('Database reinitialized successfully');
    res.json({ success: true, message: 'Database reinitialized successfully' });
  } catch (error) {
    logger.error('Error reinitializing database:', error);
    res.status(500).json({ error: 'Failed to reinitialize database' });
  }
});

// Reset database endpoint
app.post('/admin/reset-database', authenticateToken, async (req, res) => {
  try {
    logger.info('Resetting database...');
    
    db.serialize(() => {
      db.run('DELETE FROM section_scores');
      db.run('DELETE FROM detailed_answers');
      db.run('DELETE FROM quiz_results');
    });
    
    logger.info('Database reset successfully');
    return res.json({ message: 'Database reset successfully' });
  } catch (error) {
    logger.error('Error resetting database:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Delete result endpoint
app.delete('/results/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if result exists
    const result = db.get('SELECT id FROM quiz_results WHERE id = ?', id);
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }

    // Enable foreign key support
    db.run('PRAGMA foreign_keys = ON');

    // Delete result (related records will be deleted automatically due to ON DELETE CASCADE)
    const deleteStmt = db.prepare('DELETE FROM quiz_results WHERE id = ?');
    const info = deleteStmt.run(id);

    if (info.changes === 0) {
      return res.status(404).json({ error: 'Result not found' });
    }

    return res.json({ message: 'Result deleted successfully' });
  } catch (error) {
    logger.error('Error in delete operation:', error);
    return res.status(500).json({ 
      error: 'Failed to delete result',
      details: error.message 
    });
  }
});

app.delete('/results', authenticateToken, async (req, res) => {
  try {
    db.serialize(() => {
      db.run('DELETE FROM section_scores');
      db.run('DELETE FROM detailed_answers');
      db.run('DELETE FROM quiz_results');
    });
    
    return res.json({ message: 'All results deleted successfully' });
  } catch (error) {
    logger.error('Error deleting all results:', error);
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

// Health check endpoint
app.get('/health', (req, res) => {
  try {
    // Try a simple database query
    db.get('SELECT 1');
    res.json({ status: 'healthy', message: 'Service is running' });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(500).json({ status: 'unhealthy', message: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  // Give time for logs to be written
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Give time for logs to be written
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received. Closing HTTP server...');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  logger.info(`CORS enabled for origins: ${currentConfig.allowedOrigins.join(', ')}`);
});
