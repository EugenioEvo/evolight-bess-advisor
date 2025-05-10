
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SimuladorPage from './pages/SimuladorPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AcademiaPage from './pages/AcademiaPage';
import DocumentacaoPage from './pages/DocumentacaoPage';
import SobreEvolightPage from './pages/SobreEvolightPage';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';
import DieselBessPage from './pages/DieselBessPage';
import WizardPage from './pages/WizardPage';
import AuthGuard from './components/AuthGuard';
import { Toaster } from './components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster as SonnerToaster } from 'sonner';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/simulador"
            element={
              <AuthGuard>
                <SimuladorPage />
              </AuthGuard>
            }
          />
          <Route
            path="/wizard"
            element={
              <WizardPage />
            }
          />
          <Route path="/academia" element={<AcademiaPage />} />
          <Route path="/documentacao" element={<DocumentacaoPage />} />
          <Route path="/sobre-evolight" element={<SobreEvolightPage />} />
          <Route path="/diesel-bess" element={<DieselBessPage />} />
          <Route
            path="/profile"
            element={
              <AuthGuard>
                <ProfilePage />
              </AuthGuard>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <SonnerToaster richColors position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
