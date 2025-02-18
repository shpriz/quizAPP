import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import './Welcome.css';

interface WelcomeProps {
  onStart: (data: { firstName: string; lastName: string }) => void;
  onAdmin: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({ firstName, lastName });
  };

  return (
    <Container className="welcome-container">
      <Card className="welcome-card">
        <Card.Body>
          <h2 className="text-center mb-4">Добро пожаловать!</h2>
          
          {!showForm ? (
            <>
              <div className="quiz-description">
                <p>Тест состоит из пяти блоков. В каждом блоке необходимо выбрать один или несколько вариантов ответов на вопрос.</p>
                
                <p><span className="tooth-icon"></span> Первый блок содержит вопросы, направленные на уточнение информации об анкетируемом сотруднике, а именно: возрастная группа, пол, опыт работы и наличие пройденных курсов по повышению квалификации. Данная часть анкеты не подлежит оцениванию.</p>
                
                <p><span className="tooth-icon"></span> Второй блок оценивает уровень гигиены полости рта и возможности его улучшения у пациентов психоневрологического интерната, уточнение проблем, возникающих у них при чистке зубов.</p>
                
                <p><span className="tooth-icon"></span> Третий блок необходим для сбора информации о гигиене полости рта и помощи при ее проведении у лиц, находящихся в отделении милосердия.</p>
                
                <p><span className="tooth-icon"></span> Четвертый блок оценивает уровень и регулярность оказания стоматологической помощи пациентам, проживающим в условиях психоневрологического интерната.</p>
                
                <p><span className="tooth-icon"></span> Пятый блок оценивает образ жизни и питание пациентов психоневрологических интернатов.</p>
                
                <div className="rules">
                  <p>При проведении опроса необходимо соблюдать все общие правила, которые способствуют созданию соответствующей атмосферы тестирования.</p>
                  <p className="no-time-limit">Ограничений по времени не предусмотрено.</p>
                </div>
              </div>
              <div className="text-center">
                <button className="start-button" onClick={() => setShowForm(true)}>
                  Начать тест
                </button>
              </div>
            </>
          ) : (
            <Form onSubmit={handleSubmit} className="user-form">
              <Form.Group className="mb-3">
                <Form.Label>Имя</Form.Label>
                <Form.Control
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="Введите ваше имя"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Фамилия</Form.Label>
                <Form.Control
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder="Введите вашу фамилию"
                />
              </Form.Group>

              <div className="d-flex justify-content-between">
                <Button variant="secondary" onClick={() => setShowForm(false)}>
                  Назад
                </Button>
                <Button variant="primary" type="submit">
                  Продолжить
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Welcome;
