import { Routes, Route } from 'react-router-dom';
import Landing from '../pages/Landing';
import Login from '../components/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import PrivateRoute from '../components/PrivateRoute';
import CreateProblem from '../pages/CreateProblem';
import ProblemList from '../pages/ProblemList';
import ProblemPage from '../pages/ProblemPage';
import EditProblem from '../pages/EditProblem';
import CompilerPage from '../pages/CompilerPage';

<Routes>
  ...
  <Route path="/compiler" element={<CompilerPage />} />
</Routes>

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/create-problem" element={<PrivateRoute><CreateProblem /></PrivateRoute>} />
      <Route path="/problems" element={<ProblemList />} />
      <Route path="/problem/:id" element={<ProblemPage />} />
      <Route path="/edit-problem/:id" element={<PrivateRoute><EditProblem /></PrivateRoute>} />
      <Route path="/compiler" element={<CompilerPage />} />
    </Routes>
  );
}
