import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search, BookOpen, Mail, HelpCircle } from 'lucide-react';

const quickLinks = [
  { icon: BookOpen, label: 'Features', href: '/features' },
  { icon: HelpCircle, label: 'Pricing', href: '/pricing' },
  { icon: Mail, label: 'Contact', href: '/contact' },
];

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container max-w-lg text-center">
          {/* 404 Illustration */}
          <div className="relative mb-8">
            <div className="text-[120px] md:text-[180px] font-bold text-primary/10 leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Search className="w-10 h-10 text-primary" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-3">Oops! Page not found</h1>
          <p className="text-lg text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="gradient-primary text-primary-foreground" asChild>
              <Link to="/">
                <Home className="w-5 h-5 mr-2" />
                Go to Homepage
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/pricing">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Pricing
              </Link>
            </Button>
          </div>

          {/* Quick Links */}
          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">Or try one of these pages:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
