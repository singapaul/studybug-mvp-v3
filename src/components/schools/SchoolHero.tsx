import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight, Download, Users, Clock, BarChart3 } from 'lucide-react';

export function SchoolHero() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-background to-primary/5" />

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6">
            <Building2 className="w-4 h-4" />
            For Schools & Institutions
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Engage Every Student with{' '}
            <span className="text-gradient">Interactive Revision Games</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Trusted by schools across the UK to improve exam results and make learning memorable.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              asChild
            >
              <Link to="/schools/demo">
                Request a Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Brochure
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Building2, value: '500+', label: 'UK Schools' },
            { icon: Users, value: '100K+', label: 'Students' },
            { icon: Clock, value: '12 min', label: 'Avg. session' },
            { icon: BarChart3, value: '40%', label: 'Grade boost' },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-card border border-border shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
