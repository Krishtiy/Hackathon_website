import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';

// Layouts and Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Modal from './components/Modal';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Participant Dashboard
import DashboardPage from './pages/dashboard/DashboardPage';
import QuizTaker from './pages/dashboard/quizTaker';

// Admin Dashboard
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// --- 1. THE CORRECT, WORKING PROTECTED ROUTE ---
// We define it right here so we know it's the correct version.
const ProtectedRoute = ({ children, role }) => {
  const { isLoggedIn, user } = useAppContext();

  // This check waits for the AppContext to finish loading the user
  if (user === null) {
    // Show a loading screen while we verify the user
    return <div className="text-center p-10 text-white">Loading...</div>;
  }
  
  // After loading, check if they are logged in
  if (!isLoggedIn) {
    // If not, send them to the login page
    return <Navigate to="/login" replace />;
  }
  
  // After loading, check if they have the correct role
  if (role && user.role !== role) {
    // If they are the wrong role (e.g., a user trying /admin), send to home
    return <Navigate to="/" replace />;
  }
  
  // If all checks pass, show the page they asked for
  return children;
};


export default function App() {
  const { modal, closeModal }= useAppContext();

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Modal message={modal.message} type={modal.type} onClose={closeModal} />
      <Navbar />
      
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* --- 2. ALL ROUTES ARE NOW WRAPPED WITH THE CORRECT <ProtectedRoute> --- */}
          
          {/* Participant Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute role="user">
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/quiz/1" 
            element={
              <ProtectedRoute role="user">
                <QuizTaker />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Protected Route */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute role="admin">
                <AdminDashboardPage />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all route (redirects to home) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}