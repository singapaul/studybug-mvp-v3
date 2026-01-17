import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight, Download, Users, Clock, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export function SchoolHero() {
  return (
    <section className="relative py-24 overflow-hidden bg-secondary">
      <div className="absolute top-10 left-[10%] w-48 h-48 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute bottom-10 right-[15%] w-64 h-64 rounded-full bg-primary/10 blur-2xl" />

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-secondary text-sm font-semibold mb-6 shadow-md"
          >
            <Building2 className="w-4 h-4" />
            For Schools & Institutions
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
          >
            Engage Every Student with{' '}
            <span className="text-warning">Interactive Revision Games</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/80 mb-8 max-w-2xl mx-auto"
          >
            Trusted by schools across the UK to improve exam results and make learning memorable.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-white text-secondary hover:bg-white/90 rounded-full shadow-lg"
              asChild
            >
              <Link to="/schools/demo">
                Request a Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 rounded-full">
              <Download className="w-4 h-4 mr-2" />
              Download Brochure
            </Button>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Building2, value: '500+', label: 'UK Schools', color: 'bg-primary' },
            { icon: Users, value: '100K+', label: 'Students', color: 'bg-coral' },
            { icon: Clock, value: '12 min', label: 'Avg. session', color: 'bg-warning' },
            { icon: BarChart3, value: '40%', label: 'Grade boost', color: 'bg-accent' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -4 }}
              className="text-center p-6 rounded-3xl bg-white shadow-xl"
            >
              <motion.div 
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-3 shadow-md`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </motion.div>
              <div className="text-2xl md:text-3xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
