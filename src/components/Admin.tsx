import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Form, Row, Col, Card } from 'react-bootstrap';
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
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
  const [nameFilter, setNameFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при удалении');
    }
  };

  const handleExport = async (format: 'csv' | 'excel') => {
    try {
      const token = localStorage.getItem('adminToken');
      const queryParams = new URLSearchParams();
      
      if (dateFilter.from) queryParams.append('from', dateFilter.from);
      if (dateFilter.to) queryParams.append('to', dateFilter.to);
      if (nameFilter) queryParams.append('name', nameFilter);

      const response = await fetch(getApiUrl(`${API_ENDPOINTS.results}/${format}?${queryParams}`), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Не удалось экспортировать результаты');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `test_results.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при экспорте');
    }
  };

  const handleResetDatabase = async () => {
    if (!window.confirm('ВНИМАНИЕ! Это действие удалит ВСЕ результаты тестирования. Вы уверены?')) {
      return;
    }
    const confirmText = window.prompt('Для подтверждения введите "УДАЛИТЬ"');
    if (confirmText !== 'УДАЛИТЬ') {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(getApiUrl('/api/admin/reset-database'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Не удалось сбросить базу данных');
      }

      await fetchResults();
      alert('База данных успешно очищена');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при сбросе базы данных');
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={setIsAuthenticated} />;
  }

  const filteredResults = results.filter(result => {
    const matchesName = nameFilter ? 
      (result.first_name + ' ' + result.last_name).toLowerCase().includes(nameFilter.toLowerCase()) :
      true;
    
    const matchesDate = (dateFilter.from && dateFilter.to) ?
      new Date(result.completion_date) >= new Date(dateFilter.from) &&
      new Date(result.completion_date) <= new Date(dateFilter.to) :
      true;

    return matchesName && matchesDate;
  });

  const totalPages = Math.ceil(filteredResults.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return (
    <Container className="mt-4">
      <h2>Панель администратора</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4">
        <Card.Body>
          <h4>Фильтры</h4>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Поиск по имени</Form.Label>
                <Form.Control
                  type="text"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  placeholder="Введите имя или фамилию"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Дата от</Form.Label>
                <Form.Control
                  type="date"
                  value={dateFilter.from}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, from: e.target.value }))}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Дата до</Form.Label>
                <Form.Control
                  type="date"
                  value={dateFilter.to}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, to: e.target.value }))}
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Form.Group>
              <Form.Label>Строк на странице</Form.Label>
              <Form.Select 
                value={pageSize} 
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1); // Сбрасываем на первую страницу при изменении размера
                }}
                className="w-auto ms-2"
              >
                <option value="10">10</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </Form.Select>
            </Form.Group>

            <div>
              <Button 
                variant="outline-primary" 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="me-2"
              >
                &lt; Предыдущая
              </Button>
              <span className="mx-2">
                Страница {currentPage} из {totalPages}
              </span>
              <Button 
                variant="outline-primary" 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="ms-2"
              >
                Следующая &gt;
              </Button>
            </div>
          </div>
          <div className="mb-3">
            <Button 
              variant="success" 
              onClick={() => handleExport('excel')} 
              className="me-2"
            >
              <i className="bi bi-file-excel me-1"></i>
              Экспорт в Excel
            </Button>
            <Button 
              variant="info" 
              onClick={() => handleExport('csv')}
            >
              <i className="bi bi-file-text me-1"></i>
              Экспорт в CSV
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Фамилия</th>
            <th>Дата</th>
            <th>Общий балл</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredResults.slice(startIndex, endIndex).map((result) => (
            <tr key={result.id}>
              <td>{result.id}</td>
              <td>{result.first_name}</td>
              <td>{result.last_name}</td>
              <td>{new Date(result.completion_date).toLocaleDateString()}</td>
              <td>{result.total_score}</td>
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

      <Card className="mt-4 border-danger">
        <Card.Header className="bg-danger text-white">Опасная зона</Card.Header>
        <Card.Body>
          <h5>Сброс базы данных</h5>
          <p className="text-danger">
            Внимание! Это действие необратимо удалит все результаты тестирования из базы данных.
          </p>
          <Button 
            variant="outline-danger"
            onClick={handleResetDatabase}
          >
            Сбросить базу данных
          </Button>
        </Card.Body>
      </Card>

      <Button 
        variant="secondary" 
        onClick={onBackToWelcome}
        className="mt-4"
      >
        Вернуться на главную
      </Button>
    </Container>
  );
};

export default Admin;
