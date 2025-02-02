import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the original questions file content
const questionsContent = readFileSync(
  join(__dirname, '../../TEST/Quizz/userdata/questions.js'),
  'utf8'
);

// Extract the Questions array from the file content
const Questions = eval(questionsContent.replace('const Questions = ', ''));

// Group questions by test_id and profile
const groupedQuestions = Questions.reduce((acc, q) => {
  if (!acc[q.test_id]) {
    acc[q.test_id] = {
      title: q.profile,
      questions: []
    };
  }

  acc[q.test_id].questions.push({
    qText: q.text,
    picture: q.picture || '',
    qAnswers: q.answers.map((text, idx) => ({
      text,
      value: q.ballsAnswers[idx]
    }))
  });

  return acc;
}, {});

// Convert to array and sort by test_id
const quizData = Object.values(groupedQuestions);

// Write the new quiz data
writeFileSync(
  join(__dirname, '../public/data/quiz-data.json'),
  JSON.stringify(quizData, null, 2),
  'utf8'
);
