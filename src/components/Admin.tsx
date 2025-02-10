import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Form, Row, Col, Card } from 'react-bootstrap';
import AdminLogin from './AdminLogin';
import { api, API_ENDPOINTS, DatabaseResponse } from '../config/api';


interface AdminProps {
  onBackToWelcome: () => void;
}




interface Result {
  id: number;
  first_name: string;
  last_name: string;
  created_at: string;
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


  const fetchResults = async () => {
    try {
        const queryParams = new URLSearchParams();
        if (dateFilter.from) queryParams.append('from', dateFilter.from);
        if (dateFilter.to) queryParams.append('to', dateFilter.to);
        if (nameFilter) queryParams.append('name', nameFilter);
    
        const data = await api.get<Result[]>(`${API_ENDPOINTS.RESULTS}?${queryParams.toString()}`);
        setResults(data);
        setError('');
    } catch (err: any) {
        if (err.status === 401) {
            setIsAuthenticated(false);
            localStorage.removeItem('adminToken');
            setError('Сессия истекла. Пожалуйста, войдите снова.');
        } else {
            setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке результатов');
        }
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
        const response = await api.delete<DatabaseResponse>(`${API_ENDPOINTS.RESULTS}/${id}`);
        console.log('Delete response:', response);
        
        if (response.success) {
            await fetchResults(); // Refresh the list after successful deletion
            setError('');
        }
    } catch (err: any) {
        console.error('Error in handleDeleteResult:', err);
        if (err.status === 401) {
            setIsAuthenticated(false);
            localStorage.removeItem('adminToken');
            setError('Сессия истекла. Пожалуйста, войдите снова.');
        } else {
            setError(err instanceof Error ? err.message : 'Произошла ошибка при удалении результата');
        }
    }
};


const handleExport = async (format: 'csv' | 'excel') => {
  try {
      const queryParams = new URLSearchParams();
      if (dateFilter.from) queryParams.append('from', dateFilter.from);
      if (dateFilter.to) queryParams.append('to', dateFilter.to);
      if (nameFilter) queryParams.append('name', nameFilter);
      queryParams.append('format', format);

      const headers = {
          'Accept': format === 'excel' 
              ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              : 'text/csv'
      };

      const response = await api.getWithHeaders(
          `${API_ENDPOINTS.RESULTS}?${queryParams.toString()}`,
          headers
      );

      const blob = await response.blob();
      if (blob.size === 0) {
          throw new Error('Получен пустой файл');
      }

      const contentDisposition = response.headers.get('content-disposition');
      const filename = contentDisposition
          ? contentDisposition.split('filename=')[1].replace(/"/g, '')
          : `test_results.${format === 'excel' ? 'xlsx' : format}`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
      }, 100);

      setError('');
  } catch (err: any) {
      console.error('Export error:', err);
      if (err.status === 401) {
          setIsAuthenticated(false);
          localStorage.removeItem('adminToken');
          setError('Сессия истекла. Пожалуйста, войдите снова.');
      } else {
          setError(err instanceof Error ? err.message : 'Произошла ошибка при экспорте');
      }
  }
};

const handleResetDatabase = async () => {
  if (!window.confirm('Вы уверены, что хотите сбросить базу данных? Это действие нельзя отменить!')) {
      return;
  }

  try {
      const data = await api.post<DatabaseResponse>(API_ENDPOINTS.ADMIN_RESET_DB, {});
      console.log('Reset response:', data);
      
      await fetchResults();
      setError('');
  } catch (err: any) {
      console.error('Error in handleResetDatabase:', err);
      if (err.status === 401) {
          setIsAuthenticated(false);
          localStorage.removeItem('adminToken');
          setError('Необходима авторизация');
      } else {
          setError(err instanceof Error ? err.message : 'Произошла ошибка при сбросе базы данных');
      }
  }
};




const handleReinitDatabase = async () => {
  if (!window.confirm('Вы уверены, что хотите реинициализировать базу данных? Это пересоздаст все таблицы с новой схемой. Все данные будут потеряны!')) {
      return;
  }

  try {
      const data = await api.post<DatabaseResponse>(API_ENDPOINTS.ADMIN_REINIT_DB, {});
      console.log('Reinit response:', data);
      
      await fetchResults();
      setError('');
  } catch (err: any) {
      console.error('Error in handleReinitDatabase:', err);
      if (err.status === 401) {
          setIsAuthenticated(false);
          localStorage.removeItem('adminToken');
          setError('Необходима авторизация');
      } else {
          setError(err instanceof Error ? err.message : 'Произошла ошибка при реинициализации базы данных');
      }
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
      new Date(result.created_at) >= new Date(dateFilter.from) &&
      new Date(result.created_at) <= new Date(dateFilter.to) :
      true;

    return matchesName && matchesDate;
  });

  const startIndex = 0;
  const endIndex = 10;

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
            <div>
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
              <td>{new Date(result.created_at).toLocaleString('ru-RU')}</td>
              <td>{result.total_score}</td>
              <td>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleDeleteResult(result.id)}
                  className="me-2"
                >
                  <i className="bi bi-trash"></i> Удалить
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Card className="mt-4 border-danger">
        <Card.Header className="bg-danger text-white">Опасная зона</Card.Header>
        <Card.Body>
          <p className="text-danger">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Внимание! Эти действия необратимы!
          </p>
          <Button 
            variant="danger" 
            onClick={handleResetDatabase}
            className="me-2"
          >
            <i className="bi bi-trash me-2"></i>
            Сбросить базу данных
          </Button>
          <Button 
            variant="danger" 
            onClick={handleReinitDatabase}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Реинициализировать БД
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
