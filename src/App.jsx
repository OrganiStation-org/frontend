import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HRPage from './pages/HRPage';
import ProjectsPage from './pages/ProjectsPage';
import FinancePage from './pages/FinancePage';
import MyFinancePage from './pages/MyFinancePage';
import AIPage from './pages/AIPage';
import LeavesPage from './pages/LeavesPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';
import ChangePasswordPage from './pages/ChangePasswordPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/hr" element={<ProtectedRoute><HRPage /></ProtectedRoute>} />
          <Route path="/leaves" element={<ProtectedRoute><LeavesPage /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute requiredPermission="projects:read"><ProjectsPage /></ProtectedRoute>} />
          <Route path="/finance" element={<ProtectedRoute requiredPermission="finance:read"><FinancePage /></ProtectedRoute>} />
          <Route path="/my-finance" element={<ProtectedRoute><MyFinancePage /></ProtectedRoute>} />
          <Route path="/ai" element={<ProtectedRoute requiredPermission="ai:chat"><AIPage /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
