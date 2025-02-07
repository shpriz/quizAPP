import React, { useState } from 'react';
import { 
  Route, 
  Navigate, 
  useNavigate,
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Outlet,
  useOutletContext
} from 'react-router-dom';
import Welcome from './components/Welcome';
import ThankYou from './components/ThankYou';
import Admin from './components/Admin';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Quiz from './components/Quiz';

const AppLayout: React.FC = () => {
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
    navigate('/thank-you');
  };

  const handleAdmin = () => {
    navigate('/admin');
  };

  return (
    <div className="App">
      <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid">
          <span className="navbar-brand">Тест по гигиене полости рта, оказанию стоматологической помощи и образу жизни людей, проживающих в психоневрологических интернатах</span>
          <div className="d-flex">
            <button
              type="button"
              className="btn btn-outline-light ms-2"
              onClick={handleAdmin}
            >
              <i className="bi bi-lock"></i> Панель администратора
            </button>
          </div>
        </div>
      </nav>
      <div className="content">
        <Outlet context={{ 
          firstName, 
          lastName, 
          handleStart, 
          handleComplete, 
          handleAdmin,
          navigate 
        }} />
      </div>
    </div>
  );
};

const IndexRoute: React.FC = () => {
  const context = useOutletContext<{
    handleStart: (data: { firstName: string; lastName: string }) => void;
    handleAdmin: () => void;
  }>();
  return <Welcome onStart={context.handleStart} onAdmin={context.handleAdmin} />;
};

const QuizRoute: React.FC = () => {
  const context = useOutletContext<{
    firstName: string;
    lastName: string;
    handleComplete: () => void;
  }>();
  if (!context.firstName || !context.lastName) {
    return <Navigate to="/" replace />;
  }
  return (
    <Quiz 
      firstName={context.firstName}
      lastName={context.lastName}
      onComplete={context.handleComplete}
    />
  );
};

const ThankYouRoute: React.FC = () => {
  const context = useOutletContext<{
    handleAdmin: () => void;
  }>();
  return <ThankYou onAdmin={context.handleAdmin} />;
};

const AdminRoute: React.FC = () => {
  const context = useOutletContext<{
    navigate: (path: string) => void;
  }>();
  return <Admin onBackToWelcome={() => context.navigate('/')} />;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/" element={<IndexRoute />} />
      <Route path="/quiz" element={<QuizRoute />} />
      <Route path="/thank-you" element={<ThankYouRoute />} />
      <Route path="/admin" element={<AdminRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  )
);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
