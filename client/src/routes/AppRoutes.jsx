
import { Routes, Route } from 'react-router-dom';
import Landing from '../pages/Landing';
import Login from '../components/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import AdminRoute from '../components/AdminRoute';
import CreateProblem from '../pages/CreateProblem';
import ProblemList from '../pages/ProblemList';
import ProblemPage from '../pages/ProblemPage';
import EditProblem from '../pages/EditProblem';
import CompilerPage from '../pages/CompilerPage';
import LeaderboardPage from '../pages/leaderboardPage';
import PathExplorer from '../pages/PathExplorer';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} /> {/* Ensure this route is present */}
      <Route path="/create-problem" element={<AdminRoute><CreateProblem /></AdminRoute>} /> 
      <Route path="/problems" element={<ProblemList />} />
      <Route path="/problem/:id" element={<ProblemPage />} />
      <Route path="/compiler" element={<CompilerPage />} />
      <Route path="/solve/:id" element={<CompilerPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} /> 
      <Route path="/path-explorer" element={<PathExplorer />} />
      
    </Routes>
  );
}
