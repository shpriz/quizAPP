import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import AdminLogin from './AdminLogin';
import { getApiUrl, API_ENDPOINTS } from '../config/api';

interface AdminProps {
  onBackToWelcome: () => void;
}

interface Result {
  id: number;
  first_name: string;
  last_name: string;
  completion_date: string;
  total_score: number;
  test1_score: number;
  test2_score: number;
  test3_score: number;
  test4_score: number;
  test1_result: string;
  test2_result: string;
  test3_result: string;
  test4_result: string;
}

const Admin: React.FC<AdminProps> = ({ onBackToWelcome }) => {
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(getApiUrl(API_ENDPOINTS.results), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setIsAuthenticated(false);
          localStorage.removeItem('adminToken');
          throw new Error('Необходима авторизация');
        }
        throw new Error('Не удалось загрузить результаты');
      }

      const data = await response.json();
      setResults(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching results:', error);
      setError(error instanceof Error ? error.message : 'Не удалось загрузить результаты');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchResults();
    }
  }, [isAuthenticated]);

  const handleDeleteResult = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот результат?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(getApiUrl(`${API_ENDPOINTS.results}/${id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Не удалось удалить результат');
      }

      await fetchResults();
      setError(null);
    } catch (error) {
      console.error('Error deleting result:', error);
      setError(error instanceof Error ? error.message : 'Не удалось удалить результат');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={setIsAuthenticated} />;
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Результаты тестирования</h2>
        <div>
          <Button variant="secondary" onClick={onBackToWelcome} className="me-2">
            На главную
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Выйти
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Фамилия</th>
            <th>Общий балл</th>
            <th>Тест 1</th>
            <th>Тест 2</th>
            <th>Тест 3</th>
            <th>Тест 4</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.id}>
              <td>{result.first_name}</td>
              <td>{result.last_name}</td>
              <td>{result.total_score}</td>
              <td>{result.test1_score}</td>
              <td>{result.test2_score}</td>
              <td>{result.test3_score}</td>
              <td>{result.test4_score}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteResult(result.id)}
                >
                  Удалить
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Admin;
