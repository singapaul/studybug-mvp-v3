import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ThemeProvider } from "@/context/ThemeContext";
import { LocaleProvider } from "@/context/LocaleContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/app/AppLayout";

// Public pages
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Features from "./pages/Features";
import HowItWorks from "./pages/HowItWorks";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";

// Tutor pages
import TutorDashboard from "./pages/app/tutor/TutorDashboard";
import Classes from "./pages/app/tutor/Classes";
import CreateClass from "./pages/app/tutor/CreateClass";
import ClassDetail from "./pages/app/tutor/ClassDetail";
import Games from "./pages/app/tutor/Games";
import CreateGame from "./pages/app/tutor/CreateGame";
import Assignments from "./pages/app/tutor/Assignments";
import CreateAssignment from "./pages/app/tutor/CreateAssignment";
import AssignmentDetail from "./pages/app/tutor/AssignmentDetail";
import Billing from "./pages/app/tutor/Billing";
import TutorSettings from "./pages/app/tutor/Settings";

// Student pages
import StudentDashboard from "./pages/app/student/StudentDashboard";
import StudentAssignments from "./pages/app/student/StudentAssignments";
import PlayGame from "./pages/app/student/PlayGame";
import GameResult from "./pages/app/student/GameResult";
import StudentScores from "./pages/app/student/StudentScores";
import StudentSettings from "./pages/app/student/StudentSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <LocaleProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/features" element={<Features />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/help" element={<Help />} />
                <Route path="/blog" element={<Blog />} />

                {/* Tutor routes */}
                <Route path="/app/tutor" element={<ProtectedRoute requiredRole="tutor"><AppLayout /></ProtectedRoute>}>
                  <Route path="dashboard" element={<TutorDashboard />} />
                  <Route path="classes" element={<Classes />} />
                  <Route path="classes/create" element={<CreateClass />} />
                  <Route path="classes/:id" element={<ClassDetail />} />
                  <Route path="games" element={<Games />} />
                  <Route path="games/create" element={<CreateGame />} />
                  <Route path="assignments" element={<Assignments />} />
                  <Route path="assignments/create" element={<CreateAssignment />} />
                  <Route path="assignments/:id" element={<AssignmentDetail />} />
                  <Route path="billing" element={<Billing />} />
                  <Route path="settings" element={<TutorSettings />} />
                </Route>

                {/* Student routes */}
                <Route path="/app/student" element={<ProtectedRoute requiredRole="student"><AppLayout /></ProtectedRoute>}>
                  <Route path="dashboard" element={<StudentDashboard />} />
                  <Route path="assignments" element={<StudentAssignments />} />
                  <Route path="assignments/:id/play" element={<PlayGame />} />
                  <Route path="assignments/:id/result" element={<GameResult />} />
                  <Route path="scores" element={<StudentScores />} />
                  <Route path="settings" element={<StudentSettings />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LocaleProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
