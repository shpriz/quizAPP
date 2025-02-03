import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Form, Row, Col } from 'react-bootstrap';
import AdminLogin from './AdminLogin';

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
  const [selectedResults, setSelectedResults] = useState<number[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3002/api/results', {
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
        throw new Error('Failed to fetch results');
      }

      const data = await response.json();
      setResults(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching results:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch results');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchResults();
    }
  }, [isAuthenticated]);

  const handleExportSelected = async () => {
    if (selectedResults.length === 0) {
      setError('Выберите результаты для экспорта');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3002/api/results/excel', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resultIds: selectedResults,
          startDate: startDate || undefined,
          endDate: endDate || undefined
        })
      });

      if (!response.ok) {
        throw new Error('Failed to export results');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'quiz_results.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setError(null);
    } catch (error) {
      console.error('Error exporting results:', error);
      setError('Failed to export results');
    }
  };

  const handleExportAll = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3002/api/results/excel', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resultIds: results.map(r => r.id),
          startDate: startDate || undefined,
          endDate: endDate || undefined
        })
      });

      if (!response.ok) {
        throw new Error('Failed to export results');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'quiz_results.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setError(null);
    } catch (error) {
      console.error('Error exporting results:', error);
      setError('Failed to export results');
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить все результаты?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3002/api/results', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete results');
      }

      setResults([]);
      setSelectedResults([]);
      setError(null);
    } catch (error) {
      console.error('Error deleting results:', error);
      setError('Failed to delete results');
    }
  };

  const handleDatabaseAction = async (action: 'init' | 'reset') => {
    if (action === 'reset' && !window.confirm('Вы уверены, что хотите сбросить базу данных? Все данные будут удалены!')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3002/api/admin/init-db', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action })
      });

      if (!response.ok) {
        throw new Error('Failed to perform database action');
      }

      const data = await response.json();
      if (action === 'reset') {
        setResults([]);
        setSelectedResults([]);
      }
      alert(data.message);
    } catch (error) {
      console.error('Database action error:', error);
      setError('Failed to perform database action');
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedResults(results.map(r => r.id));
    } else {
      setSelectedResults([]);
    }
  };

  const handleSelectResult = (id: number) => {
    setSelectedResults(prev => {
      if (prev.includes(id)) {
        return prev.filter(r => r !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={setIsAuthenticated} />;
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Результаты тестирования</h2>
        <div>
          <Button 
            variant="outline-primary" 
            onClick={handleExportSelected} 
            className="me-2"
            disabled={selectedResults.length === 0}
          >
            Экспорт выбранных ({selectedResults.length})
          </Button>
          <Button 
            variant="outline-primary" 
            onClick={handleExportAll} 
            className="me-2"
            disabled={results.length === 0}
          >
            Экспорт всех
          </Button>
          <Button variant="outline-danger" onClick={handleDeleteAll} className="me-2">
            Удалить все
          </Button>
          <Button variant="outline-secondary" onClick={handleLogout} className="me-2">
            Выйти
          </Button>
          <Button variant="primary" onClick={onBackToWelcome}>
            Вернуться на главную
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="mb-4 p-3 border rounded">
        <h5>Управление базой данных</h5>
        <div className="d-flex gap-2">
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={() => handleDatabaseAction('init')}
          >
            Инициализировать БД
          </Button>
          <Button 
            variant="outline-danger" 
            size="sm"
            onClick={() => handleDatabaseAction('reset')}
          >
            Сбросить БД
          </Button>
        </div>
      </div>

      <Row className="mb-4">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Начальная дата</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Конечная дата</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>
              <Form.Check
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedResults.length === results.length && results.length > 0}
              />
            </th>
            <th>Имя</th>
            <th>Фамилия</th>
            <th>Дата</th>
            <th>Общий балл</th>
            <th>Тест 1</th>
            <th>Тест 2</th>
            <th>Тест 3</th>
            <th>Тест 4</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.id}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedResults.includes(result.id)}
                  onChange={() => handleSelectResult(result.id)}
                />
              </td>
              <td>{result.first_name}</td>
              <td>{result.last_name}</td>
              <td>{new Date(result.completion_date).toLocaleString()}</td>
              <td>{result.total_score}</td>
              <td title={result.test1_result}>{result.test1_score}</td>
              <td title={result.test2_result}>{result.test2_score}</td>
              <td title={result.test3_result}>{result.test3_score}</td>
              <td title={result.test4_result}>{result.test4_score}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Admin;
