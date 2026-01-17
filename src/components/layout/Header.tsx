import { Link, useLocation } from 'react-router-dom';
import { Bug, Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/context/ThemeContext';
import { useLocale } from '@/context/LocaleContext';
import { LocaleSelector } from '@/components/LocaleSelector';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const location = useLocation();
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useLocale();

  const isActive = (path: string) => location.pathname === path;

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const navLinks = [
    { href: '/features', label: t('nav.features') },
    { href: '/how-it-works', label: t('nav.howItWorks') },
    { href: '/pricing', label: t('nav.pricing') },
    { href: '/schools', label: t('nav.forSchools') },
  ];

  const resourceLinks = [
    { href: '/help', label: t('nav.helpCenter') },
    { href: '/contact', label: t('nav.contact') },
    { href: '/blog', label: t('nav.blog') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary shadow-md group-hover:shadow-glow transition-shadow">
            <Bug className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Study<span className="text-primary">bug</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.href) ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          {/* Resources Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {t('nav.resources')}
              <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {resourceLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link to={link.href}>{link.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          {/* Locale Selector */}
          <LocaleSelector />

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative overflow-hidden"
            aria-label="Toggle theme"
          >
            <Sun className={`h-5 w-5 transition-all duration-300 ${resolvedTheme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`} />
            <Moon className={`absolute h-5 w-5 transition-all duration-300 ${resolvedTheme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`} />
          </Button>

          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">{t('nav.login')}</Link>
          </Button>
          <Button size="sm" className="gradient-primary text-primary-foreground hover:opacity-90" asChild>
            <Link to="/signup/individual">{t('nav.startTrial')}</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          {/* Locale Selector */}
          <LocaleSelector />

          {/* Mobile Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative overflow-hidden"
            aria-label="Toggle theme"
          >
            <Sun className={`h-5 w-5 transition-all duration-300 ${resolvedTheme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`} />
            <Moon className={`absolute h-5 w-5 transition-all duration-300 ${resolvedTheme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`} />
          </Button>

          <button
            className="p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <nav className="container py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium py-3 px-2 rounded-lg ${
                  isActive(link.href) ? 'text-primary bg-primary/5' : 'text-muted-foreground'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Resources Submenu */}
            <button
              onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
              className="flex items-center justify-between text-sm font-medium py-3 px-2 rounded-lg text-muted-foreground"
            >
              {t('nav.resources')}
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileResourcesOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileResourcesOpen && (
              <div className="pl-4 space-y-1">
                {resourceLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="block text-sm py-2 px-2 text-muted-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-border">
              <Button variant="outline" asChild>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  {t('nav.login')}
                </Link>
              </Button>
              <Button className="gradient-primary text-primary-foreground" asChild>
                <Link to="/signup/individual" onClick={() => setMobileMenuOpen(false)}>
                  {t('nav.startTrial')}
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
