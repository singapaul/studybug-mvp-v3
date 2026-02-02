import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ThemeProvider } from "@/context/ThemeContext";
import { LocaleProvider } from "@/context/LocaleContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleSwitcher } from "@/components/dev/RoleSwitcher";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { Role } from "@/types/auth";
import Index from "./pages/Index";
import TutorDashboard from "./pages/tutor/TutorDashboard";
import Groups from "./pages/tutor/Groups";
import GroupDetail from "./pages/tutor/GroupDetail";
import Games from "./pages/tutor/Games";
import CreateGame from "./pages/tutor/CreateGame";
import GameBuilder from "./pages/tutor/GameBuilder";
import PreviewGame from "./pages/tutor/PreviewGame";
import StudentDashboard from "./pages/student/StudentDashboard";
import PlayGame from "./pages/student/PlayGame";
import MyScores from "./pages/student/MyScores";
import AttemptDetails from "./pages/student/AttemptDetails";
import TutorSettings from "./pages/tutor/TutorSettings";
import StudentSettings from "./pages/student/StudentSettings";
import Pricing from "./pages/Pricing";
import IndividualSignup from "./pages/IndividualSignup";
import FreeSignup from "./pages/FreeSignup";
import Login from "./pages/Login";
import Features from "./pages/Features";
import HowItWorks from "./pages/HowItWorks";
import Resources from "./pages/Resources";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import Blog from "./pages/Blog";
import Schools from "./pages/Schools";
import SchoolDemo from "./pages/SchoolDemo";
import SchoolDemoSuccess from "./pages/SchoolDemoSuccess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LocaleProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ErrorBoundary>
                <ScrollToTop />
                <Routes>
                {/* Home - Landing Page */}
                <Route path="/" element={<Index />} />

                {/* Tutor Routes */}
                <Route
                  path="/tutor/dashboard"
                  element={
                    <ProtectedRoute requiredRole={Role.TUTOR}>
                      <TutorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tutor/groups"
                  element={
                    <ProtectedRoute requiredRole={Role.TUTOR}>
                      <Groups />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tutor/groups/:groupId"
                  element={
                    <ProtectedRoute requiredRole={Role.TUTOR}>
                      <GroupDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tutor/games"
                  element={
                    <ProtectedRoute requiredRole={Role.TUTOR}>
                      <Games />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tutor/games/create"
                  element={
                    <ProtectedRoute requiredRole={Role.TUTOR}>
                      <CreateGame />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tutor/games/build/:type"
                  element={
                    <ProtectedRoute requiredRole={Role.TUTOR}>
                      <GameBuilder />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tutor/games/:gameId"
                  element={
                    <ProtectedRoute requiredRole={Role.TUTOR}>
                      <PreviewGame />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tutor/settings"
                  element={
                    <ProtectedRoute requiredRole={Role.TUTOR}>
                      <TutorSettings />
                    </ProtectedRoute>
                  }
                />

                {/* Student Routes */}
                <Route
                  path="/student/dashboard"
                  element={
                    <ProtectedRoute requiredRole={Role.STUDENT}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/play/:assignmentId"
                  element={
                    <ProtectedRoute requiredRole={Role.STUDENT}>
                      <PlayGame />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/scores"
                  element={
                    <ProtectedRoute requiredRole={Role.STUDENT}>
                      <MyScores />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/attempts/:attemptId"
                  element={
                    <ProtectedRoute requiredRole={Role.STUDENT}>
                      <AttemptDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/settings"
                  element={
                    <ProtectedRoute requiredRole={Role.STUDENT}>
                      <StudentSettings />
                    </ProtectedRoute>
                  }
                />

                {/* Marketing Pages (kept for future use) */}
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/signup/individual" element={<IndividualSignup />} />
                <Route path="/signup/free" element={<FreeSignup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/features" element={<Features />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/help" element={<Help />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/schools" element={<Schools />} />
                <Route path="/schools/demo" element={<SchoolDemo />} />
                <Route path="/schools/demo/success" element={<SchoolDemoSuccess />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>

                {/* Dev-only role switcher */}
                <RoleSwitcher />
              </ErrorBoundary>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
