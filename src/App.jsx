import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AllExercises from './pages/AllExercises';
import RandomWorkout from './pages/RandomWorkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { DisclaimerProvider } from './context/DisclaimerContext';
import { AuthProvider } from './context/AuthContext';
import { WorkoutProvider } from './context/WorkoutContext';

function App() {
  return (
    <DisclaimerProvider>
      <AuthProvider>
        <WorkoutProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <Routes>
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/exercises" element={<ProtectedRoute><AllExercises /></ProtectedRoute>} />
                <Route path="/random" element={<ProtectedRoute><RandomWorkout /></ProtectedRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              </Routes>
            </div>
          </Router>
        </WorkoutProvider>
      </AuthProvider>
    </DisclaimerProvider>
  );
}

export default App;
