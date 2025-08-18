import { Routes, Route } from 'react-router-dom';
import Landing from '../pages/Landing';
import Register from '../pages/Register';
import Login from '../components/Login';
import Dashboard from '../pages/Dashboard';
import OAuthSuccess from '../pages/OAuthSuccess';
import AdminRoute from '../components/AdminRoute';
import GuestRoute from '../components/GuestRoute';
import CreateProblem from '../pages/CreateProblem';
import EditProblem from '../pages/EditProblem';
import ProblemList from '../pages/ProblemList';
import ProblemPage from '../pages/ProblemPage';
import CompilerPage from '../pages/CompilerPage';
import LeaderboardPage from '../pages/leaderboardPage';
import PathExplorer from '../pages/PathExplorer';

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Landing />} />
    <Route path="/problems" element={<ProblemList />} />
    <Route path="/problem/:id" element={<ProblemPage />} />
    <Route path="/compiler" element={<CompilerPage />} />
    <Route path="/compiler/:id" element={<CompilerPage />} />
    {/* Back-compat for older links */}
    <Route path="/solve/:id" element={<CompilerPage />} />
    <Route path="/leaderboard" element={<LeaderboardPage />} />
    <Route path="/paths" element={<PathExplorer />} />

    {/* Guest Routes (only for non-logged-in users) */}
    <Route element={<GuestRoute />}>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/google/success" element={<OAuthSuccess />} />
    </Route>

    {/* Admin Routes */}
    <Route element={<AdminRoute />}>
      <Route path="/create-problem" element={<CreateProblem />} />
      <Route path="/edit-problem/:id" element={<EditProblem />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Route>
  </Routes>
);

export default AppRoutes;
