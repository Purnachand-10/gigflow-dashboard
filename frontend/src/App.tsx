import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import LeadsPage from './pages/leads/LeadsPage';
import LeadDetails from './pages/leads/LeadDetails';
import LeadFormPage from './pages/leads/LeadFormPage';
import ProfilePage from './pages/dashboard/ProfilePage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="leads/new" element={<LeadFormPage />} />
          <Route path="leads/:id" element={<LeadDetails />} />
          <Route path="leads/:id/edit" element={<LeadFormPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
