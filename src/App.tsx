import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Import pages
import LandingPage from './pages/LandingPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import Login from './pages/auth/Login'
import ProjectsPage from './pages/public/ProjectsPage'
import TransparencyPage from './pages/public/TransparencyPage'
import ResourcesPage from './pages/public/ResourcesPage'
import BlogPage from './pages/public/BlogPage'
import ELearningPage from './pages/public/ELearningPage'
import AboutContactPage from './pages/public/AboutContactPage'
import DonationPage from './pages/public/DonationPage'
import TestPage from './pages/TestPage'
import SupplierPortal from './pages/partner/SupplierPortal'
import DistributorPortal from './pages/partner/DistributorPortal'
import TrainerPortal from './pages/partner/TrainerPortal'
import TeamPortalDashboard from './pages/team/TeamPortalDashboard'
import DonorPortal from './pages/donor/DonorPortal'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/transparency" element={<TransparencyPage />} />
            {/* Public */}
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/elearning" element={<ELearningPage />} />
          <Route path="/about" element={<AboutContactPage />} />
          <Route path="/contact" element={<AboutContactPage />} />
          <Route path="/donate" element={<DonationPage />} />
          <Route path="/login" element={<Login />} />
          {/* Protected */}
          <Route path="/admin/*" element={<ProtectedRoute roles={['admin']} element={<AdminDashboard />} />} />
          <Route path="/partner/suppliers" element={<ProtectedRoute roles={['supplier','admin']} element={<SupplierPortal />} />} />
          <Route path="/partner/distributors" element={<ProtectedRoute roles={['distributor','admin']} element={<DistributorPortal />} />} />
          <Route path="/partner/trainers" element={<ProtectedRoute roles={['trainer','admin']} element={<TrainerPortal />} />} />
          <Route path="/team" element={<ProtectedRoute roles={['team_member','admin']} element={<TeamPortalDashboard />} />} />
          <Route path="/donor" element={<ProtectedRoute roles={['donor','admin']} element={<DonorPortal />} />} />
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
