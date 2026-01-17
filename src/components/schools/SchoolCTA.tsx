import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Mail } from 'lucide-react';

export function SchoolCTA() {
  return (
    <section className="py-20 bg-primary/5">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Transform Learning at Your School?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Book a personalized demo to see how Studybug can help your students
            achieve better results. Our education specialists will walk you
            through everything.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="gradient-primary text-primary-foreground hover:opacity-90"
              asChild
            >
              <Link to="/schools/demo">
                <Calendar className="w-4 h-4 mr-2" />
                Request a Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="mailto:schools@studybug.com">
                <Mail className="w-4 h-4 mr-2" />
                Contact Sales
              </a>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            No commitment required · Response within 24 hours
          </p>
        </div>
      </div>
    </section>
  );
}
