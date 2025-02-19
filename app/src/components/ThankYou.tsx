import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import './ThankYou.css';

interface Props {
  onAdmin: () => void;
}

const ThankYou: React.FC<Props> = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Редирект на главную через 3 секунды
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Container className="thank-you-container">
      <Card className="thank-you-card">
        <Card.Body>
          <div className="text-center">
            <h2>Спасибо за прохождение теста!</h2>
            <p>Через несколько секунд вы будете перенаправлены на главную страницу...</p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ThankYou;
