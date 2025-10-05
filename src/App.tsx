import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import './App.css'

// Import pages
const LandingPage = lazy(() => import('./pages/LandingPage'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const Login = lazy(() => import('./pages/auth/Login'))
const ProjectsPage = lazy(() => import('./pages/public/ProjectsPage'))
const TransparencyPage = lazy(() => import('./pages/public/TransparencyPage'))
const ResourcesPage = lazy(() => import('./pages/public/ResourcesPage'))
const BlogPage = lazy(() => import('./pages/public/BlogPage'))
const BlogArticlePage = lazy(() => import('./pages/public/BlogArticlePage'))
const ELearningIndexPage = lazy(() => import('./pages/public/ELearningIndexPage'))
const ELearningLessonPage = lazy(() => import('./pages/public/ELearningLessonPage'))
const ELearningModulePage = lazy(() => import('./pages/public/ELearningModulePage'))
const AboutPage = lazy(() => import('./pages/public/AboutPage'))
const ContactPage = lazy(() => import('./pages/public/ContactPage'))
const DonationPage = lazy(() => import('./pages/public/DonationPage'))
const TestPage = lazy(() => import('./pages/TestPage'))
const SupplierPortal = lazy(() => import('./pages/partner/SupplierPortal'))
const DistributorPortal = lazy(() => import('./pages/partner/DistributorPortal'))
const TrainerPortal = lazy(() => import('./pages/partner/TrainerPortal'))
const TeamPortalDashboard = lazy(() => import('./pages/team/TeamPortalDashboard'))
const DonorPortal = lazy(() => import('./pages/donor/DonorPortal'))
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage'))
import { ProtectedRoute } from './components/ProtectedRoute'
import PageSkeleton from './components/feedback/PageSkeleton'

function App() {
  return (
    <Router>
      <div className="App">
        <Suspense fallback={<PageSkeleton withHeader lines={10} />}> 
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/transparency" element={<TransparencyPage />} />
            {/* Public */}
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogArticlePage />} />
          {/* Legacy path redirect */}
          <Route path="/elearning" element={<Navigate to="/e-learning" replace />} />
          {/* E-learning minimal (new canonical path) */}
          <Route path="/e-learning" element={<ELearningIndexPage />} />
          <Route path="/e-learning/lesson/:slug" element={<ELearningLessonPage />} />
          <Route path="/e-learning/module/:slug" element={<ELearningModulePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
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
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
      </div>
    </Router>
  )
}

export default App
