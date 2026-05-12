import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';

// Pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import LearnPage from './pages/LearnPage';
import Profile from './pages/Profile';
import SwapsDashboard from './pages/swaps/SwapsDashboard';
import Messages from './pages/Messages';
import CreateCourse from './pages/teach/CreateCourse';
import BecomeTeacher from './pages/teach/BecomeTeacher';
import TeacherDashboard from './pages/teach/Dashboard';
import { useSocket } from './hooks/useSocket';

function App() {
  const { checkAuth, isLoggedIn, user } = useAuthStore();
  useSocket();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const isTeacher = user?.role === 'teacher';

  return (
    <Router>
      <Toaster position="top-center" toastOptions={{
        style: { borderRadius: '16px', fontWeight: 600 },
        success: { iconTheme: { primary: '#4f46e5', secondary: '#fff' } }
      }} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register />} />
        
        {/* Learner Protected Routes */}
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/learn/:id" element={isLoggedIn ? <LearnPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/swaps" element={isLoggedIn ? <SwapsDashboard /> : <Navigate to="/login" />} />
        <Route path="/messages" element={isLoggedIn ? <Messages /> : <Navigate to="/login" />} />

        {/* Become Teacher (logged in, non-teacher) */}
        <Route 
          path="/become-teacher" 
          element={
            !isLoggedIn ? <Navigate to="/login" /> :
            isTeacher ? <Navigate to="/teach/dashboard" /> :
            <BecomeTeacher />
          } 
        />

        {/* Teacher-Only Routes */}
        <Route 
          path="/teach/dashboard" 
          element={
            !isLoggedIn ? <Navigate to="/login" /> :
            !isTeacher ? <Navigate to="/become-teacher" /> :
            <TeacherDashboard />
          } 
        />
        <Route 
          path="/teach/create-course" 
          element={
            !isLoggedIn ? <Navigate to="/login" /> :
            !isTeacher ? <Navigate to="/become-teacher" /> :
            <CreateCourse />
          } 
        />
        <Route 
          path="/teach/edit-course/:id" 
          element={
            !isLoggedIn ? <Navigate to="/login" /> :
            !isTeacher ? <Navigate to="/become-teacher" /> :
            <CreateCourse />
          } 
        />

        {/* Legacy redirect */}
        <Route path="/teach/create" element={<Navigate to="/teach/create-course" />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
