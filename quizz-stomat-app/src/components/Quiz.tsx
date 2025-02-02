import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Alert, ProgressBar } from 'react-bootstrap';
import './Quiz.css';

interface Question {
  id: number;
  text: string;
  answers: string[];
  scores: number[];
}

interface Section {
  title: string;
  questions: Question[];
  startIndex: number;
}

interface Answer {
  questionIndex: number;
  questionId: number;
  text: string;
  score: number;
  answerIndex: number;
}

interface QuizProps {
  firstName: string;
  lastName: string;
  onComplete: () => void;
}

const Quiz: React.FC<QuizProps> = ({ firstName, lastName, onComplete }) => {
  const navigate = useNavigate();
  const [sections, setSections] = useState<Section[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/questions');
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      
      // Process sections and add startIndex
      let startIndex = 0;
      const processedSections = data.map((section: any) => {
        const processedSection = {
          ...section,
          startIndex
        };
        startIndex += section.questions.length;
        return processedSection;
      });
      
      setSections(processedSections);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to load questions. Please try again.');
    }
  };

  const getCurrentSection = () => {
    return sections.find(section => 
      currentQuestionIndex >= section.startIndex && 
      currentQuestionIndex < section.startIndex + section.questions.length
    );
  };

  const getCurrentQuestion = () => {
    const section = getCurrentSection();
    if (!section) return null;
    return section.questions[currentQuestionIndex - section.startIndex];
  };

  const handleAnswer = (selectedIndex: number) => {
    const question = getCurrentQuestion();
    if (!question) return;

    const answer: Answer = {
      questionIndex: currentQuestionIndex,
      questionId: question.id,
      text: question.answers[selectedIndex],
      score: question.scores[selectedIndex],
      answerIndex: selectedIndex
    };

    setUserAnswers(prev => {
      const newAnswers = [...prev];
      const existingIndex = newAnswers.findIndex(a => a.questionIndex === currentQuestionIndex);
      if (existingIndex >= 0) {
        newAnswers[existingIndex] = answer;
      } else {
        newAnswers.push(answer);
      }
      return newAnswers;
    });

    if (currentQuestionIndex < getTotalQuestions() - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const getTotalQuestions = () => {
    return sections.reduce((total, section) => total + section.questions.length, 0);
  };

  const handleSubmit = async () => {
    try {
      // Calculate scores for each section
      const sectionScores = sections.map(section => {
        const sectionAnswers = userAnswers.filter(answer => 
          answer.questionIndex >= section.startIndex && 
          answer.questionIndex < section.startIndex + section.questions.length
        );
        
        const score = sectionAnswers.reduce((sum, answer) => sum + answer.score, 0);
        const maxScore = section.questions.reduce((sum, q) => 
          sum + Math.max(...q.scores), 0);
        
        return {
          section_title: `Тест ${sections.indexOf(section) + 1}`,
          score,
          max_score: maxScore
        };
      });

      // Calculate total score
      const totalScore = userAnswers.reduce((sum, answer) => sum + answer.score, 0);

      // Prepare detailed answers
      const detailedAnswers = userAnswers.map(answer => {
        const section = sections.find(s => 
          answer.questionIndex >= s.startIndex && 
          answer.questionIndex < s.startIndex + s.questions.length
        );
        const sectionIndex = sections.indexOf(section!);
        const question = section!.questions[answer.questionIndex - section!.startIndex];
        
        return {
          section_title: `Тест ${sectionIndex + 1}`,
          question_id: answer.questionId,
          question_text: question.text,
          answer_text: answer.text,
          answer_index: answer.answerIndex,
          possible_score: Math.max(...question.scores),
          score: answer.score
        };
      });

      const response = await fetch('http://localhost:3002/api/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          totalScore,
          sectionScores,
          detailedAnswers
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save results');
      }

      const data = await response.json();
      onComplete();
      navigate('/thank-you', { 
        state: { 
          results: data.testResults,
          scores: data.testScores
        } 
      });
    } catch (error) {
      console.error('Error saving results:', error);
      setError('Failed to save results. Please try again.');
    }
  };

  const question = getCurrentQuestion();
  const progress = (currentQuestionIndex / getTotalQuestions()) * 100;

  if (!question) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {error || 'Failed to load questions. Please refresh the page.'}
        </Alert>
      </Container>
    );
  }

  const isLastQuestion = currentQuestionIndex === getTotalQuestions() - 1;
  const hasAnsweredCurrent = userAnswers.some(a => a.questionIndex === currentQuestionIndex);
  const currentAnswer = userAnswers.find(a => a.questionIndex === currentQuestionIndex);

  return (
    <Container className="mt-4">
      <div className="mb-4">
        <ProgressBar now={progress} label={`${Math.round(progress)}%`} />
      </div>

      <div className="quiz-content">
        <h4 className="section-title">{getCurrentSection()?.title}</h4>
        <h5 className="question-text mb-4">{question.text}</h5>

        <div className="answers-container">
          {question.answers.map((answer, index) => (
            <Button
              key={index}
              variant={currentAnswer?.text === answer ? "primary" : "outline-primary"}
              className="answer-button mb-2 w-100"
              onClick={() => handleAnswer(index)}
            >
              {answer}
            </Button>
          ))}
        </div>

        {isLastQuestion && hasAnsweredCurrent && (
          <Button 
            variant="success" 
            size="lg"
            className="submit-button mt-4"
            onClick={handleSubmit}
          >
            Завершить тест
          </Button>
        )}
      </div>

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </Container>
  );
};

export default Quiz;
