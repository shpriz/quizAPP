import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';
import './ThankYou.css';

interface Props {
  onAdmin: () => void;
}

const ThankYou: React.FC<Props> = ({ onAdmin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { results: string[], scores: number[] } | undefined;

  return (
    <Container className="thank-you-container">
      <Card className="thank-you-card">
        <Card.Body>
          <div className="text-center">
            <h2>Спасибо за прохождение теста!</h2>
            
            {state?.results && (
              <div className="results-section">
                <h3>Результаты тестирования:</h3>
                {state.results.map((result, index) => (
                  <div key={index} className="test-result">
                    <h4>Тест {index + 1}</h4>
                    <p>Количество баллов: {state.scores[index]}</p>
                    <p>{result}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="buttons-container">
              <Button 
                variant="primary" 
                onClick={() => navigate('/')}
                className="thank-you-button"
              >
                На главную
              </Button>
              <Button 
                variant="secondary" 
                onClick={onAdmin}
                className="thank-you-button"
              >
                Просмотр результатов
              </Button>
            </div>

            <p className="download-note">
              Результаты теста были сохранены в Excel файл. Если загрузка не началась автоматически,
              <Button 
                variant="link" 
                onClick={() => window.location.href = 'http://localhost:3002/api/results/excel'}
                className="download-link"
              >
                нажмите здесь
              </Button>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ThankYou;
