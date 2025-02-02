const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const jwt = require('jsonwebtoken');
const XLSX = require('xlsx');

const app = express();
app.use(cors());
app.use(express.json());

// Read quiz data from JSON file
const quizData = JSON.parse(fs.readFileSync(path.join(__dirname, 'quiz-data.json'), 'utf8'));

// Create SQLite database connection
const db = new sqlite3.Database('quiz.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Initialize database tables - only called from admin panel
async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      try {
        // Drop existing tables
        db.run(`DROP TABLE IF EXISTS detailed_answers`);
        db.run(`DROP TABLE IF EXISTS section_scores`);
        db.run(`DROP TABLE IF EXISTS quiz_results`);

        // Create tables with updated schema
        db.run(`CREATE TABLE IF NOT EXISTS quiz_results (
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
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS section_scores (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          result_id INTEGER NOT NULL,
          section_title TEXT NOT NULL,
          score INTEGER NOT NULL,
          max_score INTEGER NOT NULL,
          section_result TEXT NOT NULL,
          FOREIGN KEY (result_id) REFERENCES quiz_results(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS detailed_answers (
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
        )`);

        console.log('Database tables recreated successfully');
        resolve();
      } catch (error) {
        console.error('Error initializing database:', error);
        reject(error);
      }
    });
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

async function exportToExcel(results) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Quiz Results');

  worksheet.columns = [
    { header: 'Имя', key: 'firstName', width: 15 },
    { header: 'Фамилия', key: 'lastName', width: 15 },
    { header: 'Дата', key: 'date', width: 20 },
    { header: 'Тест 1 (Баллы)', key: 'test1Score', width: 15 },
    { header: 'Тест 1 (Результат)', key: 'test1Result', width: 50 },
    { header: 'Тест 2 (Баллы)', key: 'test2Score', width: 15 },
    { header: 'Тест 2 (Результат)', key: 'test2Result', width: 50 },
    { header: 'Тест 3 (Баллы)', key: 'test3Score', width: 15 },
    { header: 'Тест 3 (Результат)', key: 'test3Result', width: 50 },
    { header: 'Тест 4 (Баллы)', key: 'test4Score', width: 15 },
    { header: 'Тест 4 (Результат)', key: 'test4Result', width: 50 }
  ];

  results.forEach(result => {
    worksheet.addRow({
      firstName: result.first_name,
      lastName: result.last_name,
      date: new Date(result.created_at).toLocaleString(),
      test1Score: result.test1_score,
      test1Result: result.test1_result,
      test2Score: result.test2_score,
      test2Result: result.test2_result,
      test3Score: result.test3_score,
      test3Result: result.test3_result,
      test4Score: result.test4_score,
      test4Result: result.test4_result
    });
  });

  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  const filename = path.join(__dirname, 'quiz_results.xlsx');
  await workbook.xlsx.writeFile(filename);
  return filename;
}

function runQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
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
    const result = await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO quiz_results (
          first_name, last_name, total_score,
          test1_score, test2_score, test3_score, test4_score,
          test1_result, test2_result, test3_result, test4_result
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          firstName, lastName, totalScore,
          test1Score, test2Score, test3Score, test4Score,
          test1Result, test2Result, test3Result, test4Result
        ],
        function(err) {
          if (err) reject(err);
          else resolve({ lastID: this.lastID });
        }
      );
    });

    const resultId = result.lastID;

    // Insert section scores with results
    for (let i = 0; i < sectionScores.length; i++) {
      const section = sectionScores[i];
      const sectionResult = calculateTestResult(i + 1, section.score);
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO section_scores (result_id, section_title, score, max_score, section_result) VALUES (?, ?, ?, ?, ?)',
          [resultId, section.section_title, section.score, section.max_score, sectionResult],
          function(err) {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }

    // Insert detailed answers
    for (const answer of detailedAnswers) {
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO detailed_answers (result_id, section_title, question_id, question_text, answer_text, answer_index, possible_score, score) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [
            resultId,
            answer.section_title,
            answer.question_id,
            answer.question_text,
            answer.answer_text,
            answer.answer_index,
            answer.possible_score,
            answer.score
          ],
          function(err) {
            if (err) reject(err);
            else resolve();
          }
        );
      });
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
    const results = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    // Get section scores and detailed answers for each result
    const detailedResults = await Promise.all(results.map(async (result) => {
      const [sectionScores, answers] = await Promise.all([
        new Promise((resolve, reject) => {
          db.all(
            'SELECT * FROM section_scores WHERE result_id = ? ORDER BY section_title',
            [result.id],
            (err, rows) => {
              if (err) reject(err);
              else resolve(rows || []);
            }
          );
        }),
        new Promise((resolve, reject) => {
          db.all(
            'SELECT * FROM detailed_answers WHERE result_id = ? ORDER BY section_title, question_id',
            [result.id],
            (err, rows) => {
              if (err) reject(err);
              else resolve(rows || []);
            }
          );
        })
      ]);
      
      return {
        ...result,
        sectionScores,
        answers
      };
    }));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Quiz Results');

    // Define base columns
    const columns = [
      { header: 'ID результата', key: 'id' },
      { header: 'Дата', key: 'date' },
      { header: 'ФИО', key: 'name' }
    ];

    // Add answer-score pair columns
    for (let i = 0; i < 40; i++) {
      columns.push(
        { header: `Ответ ${i + 1}`, key: `answer_${i}` },
        { header: `Балл ${i + 1}`, key: `score_${i}` }
      );
    }

    // Add summary columns
    columns.push(
      { header: 'Общий балл', key: 'total_score' },
      { header: 'Описание результата', key: 'score_description' }
    );

    worksheet.columns = columns;

    // Format data rows
    const rows = detailedResults.map(r => {
      const row = {
        id: r.id,
        date: r.created_at,
        name: `${r.last_name} ${r.first_name}`
      };

      // Initialize empty answers/scores
      for (let i = 0; i < 40; i++) {
        row[`answer_${i}`] = '';
        row[`score_${i}`] = '';
      }

      // Fill actual answers/scores
      r.answers.forEach(a => {
        const qIndex = a.question_id;
        row[`answer_${qIndex}`] = a.answer_text;
        row[`score_${qIndex}`] = a.score;
      });

      // Calculate total
      const totalScore = r.answers.reduce((sum, a) => sum + a.score, 0);
      row.total_score = totalScore;
      row.score_description = totalScore <= 40 ? 'Низкий уровень' : 
                            totalScore <= 80 ? 'Средний уровень' : 
                            'Высокий уровень';

      return row;
    });

    worksheet.addRows(rows);

    // Auto-width columns
    worksheet.columns.forEach(column => {
      column.width = 20;
      column.alignment = { wrapText: true };
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=quiz_results.xlsx');

    await workbook.xlsx.write(res);
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
    db.all('SELECT * FROM quiz_results ORDER BY created_at DESC', [], async (err, results) => {
      if (err) throw err;

      const fullResults = await Promise.all(results.map(async (result) => {
        return new Promise((resolve, reject) => {
          db.all('SELECT * FROM section_scores WHERE result_id = ?', [result.id], (err, sectionScores) => {
            if (err) reject(err);
            db.all('SELECT * FROM detailed_answers WHERE result_id = ?', [result.id], (err, detailedAnswers) => {
              if (err) reject(err);
              resolve({
                ...result,
                sectionScores,
                detailedAnswers
              });
            });
          });
        });
      }));

      res.json(fullResults);
    });
  } catch (error) {
    console.error('Error getting results:', error);
    res.status(500).json({ error: 'Failed to get results' });
  }
});

app.get('/api/results/excel', authenticateToken, async (req, res) => {
  try {
    const results = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM quiz_results ORDER BY created_at DESC', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const filename = await exportToExcel(results);
    res.download(filename);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    res.status(500).json({ error: 'Failed to export results' });
  }
});

app.delete('/api/results/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    await runQuery('BEGIN TRANSACTION');
    await runQuery('DELETE FROM section_scores WHERE result_id = ?', [id]);
    await runQuery('DELETE FROM detailed_answers WHERE result_id = ?', [id]);
    await runQuery('DELETE FROM quiz_results WHERE id = ?', [id]);
    await runQuery('COMMIT');
    
    res.json({ success: true });
  } catch (error) {
    await runQuery('ROLLBACK');
    console.error('Error deleting result:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/results', authenticateToken, async (req, res) => {
  try {
    await runQuery('BEGIN TRANSACTION');
    await runQuery('DELETE FROM section_scores');
    await runQuery('DELETE FROM detailed_answers');
    await runQuery('DELETE FROM quiz_results');
    await runQuery('COMMIT');
    
    res.json({ success: true });
  } catch (error) {
    await runQuery('ROLLBACK');
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

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
