import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Welcome from './components/Welcome';
import ThankYou from './components/ThankYou';
import Admin from './components/Admin';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Button } from 'react-bootstrap';
import Quiz from './components/Quiz';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleStart = (data: { firstName: string; lastName: string }) => {
    setFirstName(data.firstName);
    setLastName(data.lastName);
    navigate('/quiz');
  };

  const handleComplete = () => {
    setFirstName('');
    setLastName('');
  };

  const handleAdmin = () => {
    navigate('/admin');
  };

  return (
    <div className="app-container">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand">Тест по гигиене полости рта, оказанию стоматологической помощи и образу жизни людей, проживающих в психоневрологических интернатах</span>
          <div className="d-flex">
            <Button
              variant="outline-light"
              onClick={handleAdmin}
              className="ms-2"
            >
              <i className="bi bi-lock"></i> Панель администратора
            </Button>
          </div>
        </div>
      </nav>
      <div className="container mt-4">
        <Routes>
          <Route 
            path="/" 
            element={
              <Welcome 
                onStart={handleStart}
                onAdmin={handleAdmin}
              />
            } 
          />
          <Route 
            path="/quiz" 
            element={
              firstName && lastName ? (
                <Quiz
                  firstName={firstName}
                  lastName={lastName}
                  onComplete={handleComplete}
                />
              ) : (
                <Navigate to="/" />
              )
            } 
          />
          <Route 
            path="/thank-you" 
            element={
              <ThankYou 
                onAdmin={handleAdmin} 
              />
            } 
          />
          <Route 
            path="/admin" 
            element={
              <Admin onBackToWelcome={() => navigate('/')} />
            } 
          />
          <Route 
            path="*" 
            element={<Navigate to="/" />} 
          />
        </Routes>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
