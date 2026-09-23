import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { GraduationCap, LogOut } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import StudentForm from './pages/StudentForm';
import StudentProfile from './pages/StudentProfile';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';

function Navbar() {
  const { currentUser, logout } = useAuth();
  
  return (
    <nav className="navbar glass-panel">
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <GraduationCap size={32} color="#60a5fa" />
        <h2 style={{ margin: 0 }}>Academic Portal</h2>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {currentUser ? currentUser.email : 'Teacher Portal'}
        </span>
        {currentUser && (
          <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
            <LogOut size={14} /> Sign Out
          </button>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="container animate-fade-in">
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/student/new" element={<ProtectedRoute><StudentForm /></ProtectedRoute>} />
            <Route path="/student/:id/edit" element={<ProtectedRoute><StudentForm /></ProtectedRoute>} />
            <Route path="/student/:id" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
