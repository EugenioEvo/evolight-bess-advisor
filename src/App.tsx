
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage";
import SimuladorPage from "./pages/SimuladorPage";
import DocumentacaoPage from "./pages/DocumentacaoPage";
import AcademiaPage from "./pages/AcademiaPage";
import SobreEvolightPage from "./pages/SobreEvolightPage";
import OnboardingPage from "./pages/OnboardingPage";
import SplashScreen from "./components/SplashScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
  
  // If user hasn't been onboarded and isn't on the splash or onboarding page, redirect to onboarding
  if (!hasOnboarded() && location.pathname !== "/" && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" />;
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <OnboardingGuard>
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/simulador" element={<SimuladorPage />} />
            <Route path="/documentacao" element={<DocumentacaoPage />} />
            <Route path="/academia" element={<AcademiaPage />} />
            <Route path="/sobre" element={<SobreEvolightPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </OnboardingGuard>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
