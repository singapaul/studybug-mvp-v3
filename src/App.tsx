import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ThemeProvider } from "@/context/ThemeContext";
import { LocaleProvider } from "@/context/LocaleContext";
import Index from "./pages/Index";
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
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LocaleProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
