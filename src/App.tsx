import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AppShell from './components/AppShell';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Investigation from './pages/Investigation';
import RootCause from './pages/RootCause';
import PatchPage from './pages/PatchPage';
import ValidationPage from './pages/Validation';
import ImpactPage from './pages/ImpactPage';
import ReportPage from './pages/ReportPage';
import EvidencePage from './pages/EvidencePage';
import ProjectPage from './pages/ProjectPage';
import TestSuite from './pages/TestSuite';
import SettingsPage from './pages/SettingsPage';

function NotFound() {
  return (
    <div className="flex items-center justify-center h-full p-8" style={{ color: 'var(--text-secondary)' }}>
      <div className="text-center">
        <div className="text-6xl font-bold font-mono mb-2" style={{ color: 'var(--border)' }}>404</div>
        <div className="text-sm">Page not found</div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          {/* Public landing */}
          <Route path="/" element={<Landing />} />

          {/* App shell wraps all workspace routes */}
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/investigate" element={<Investigation />} />
            <Route path="/root-cause" element={<RootCause />} />
            <Route path="/patch" element={<PatchPage />} />
            <Route path="/validation" element={<ValidationPage />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/evidence" element={<EvidencePage />} />
            <Route path="/project" element={<ProjectPage />} />
            <Route path="/tests" element={<TestSuite />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
