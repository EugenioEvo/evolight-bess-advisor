
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/AuthGuard";

// Pages
import HomePage from "./pages/HomePage";
import SimuladorPage from "./pages/SimuladorPage";
import DocumentacaoPage from "./pages/DocumentacaoPage";
import AcademiaPage from "./pages/AcademiaPage";
import SobreEvolightPage from "./pages/SobreEvolightPage";
import OnboardingPage from "./pages/OnboardingPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SplashScreen from "./components/SplashScreen";
import NotFound from "./pages/NotFound";

// Check if user has been onboarded
const hasOnboarded = () => {
  return localStorage.getItem("evolight-onboarded") === "true";
};

const setOnboarded = () => {
  localStorage.setItem("evolight-onboarded", "true");
};

// Route guard component
const OnboardingGuard = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  
  useEffect(() => {
    // If user completes onboarding or navigates to /home directly, mark as onboarded
    if (location.pathname === "/home" || location.pathname === "/onboarding") {
      setOnboarded();
    }
  }, [location.pathname]);
  
  return children;
};

const App = () => {
  // Create a new QueryClient instance for each component instance
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <OnboardingGuard>
              <Routes>
                <Route path="/" element={<SplashScreen />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/home" element={
                  <AuthGuard>
                    <HomePage />
                  </AuthGuard>
                } />
                <Route path="/simulador" element={
                  <AuthGuard>
                    <SimuladorPage />
                  </AuthGuard>
                } />
                <Route path="/documentacao" element={
                  <AuthGuard>
                    <DocumentacaoPage />
                  </AuthGuard>
                } />
                <Route path="/academia" element={
                  <AuthGuard>
                    <AcademiaPage />
                  </AuthGuard>
                } />
                <Route path="/sobre" element={
                  <AuthGuard>
                    <SobreEvolightPage />
                  </AuthGuard>
                } />
                <Route path="/profile" element={
                  <AuthGuard>
                    <ProfilePage />
                  </AuthGuard>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </OnboardingGuard>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
