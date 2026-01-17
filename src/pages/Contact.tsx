import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mail, Phone, MapPin, Clock, Check, AlertCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Contact() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSuccess(true);
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Questions? We're here to help. Send us a message and we'll respond within 24 hours.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-background">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
              {/* Form */}
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-2xl p-8">
                  {isSuccess ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
                        <Check className="w-8 h-8 text-success" />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        Thanks for reaching out!
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        We'll get back to you within 24 hours.
                      </p>
                      <Button onClick={() => setIsSuccess(false)} variant="outline">
                        Send another message
                      </Button>
                    </div>
                  ) : (
                    <>
                      {/* Demo Notice */}
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/10 border border-accent/20 mb-6">
                        <AlertCircle className="w-5 h-5 text-accent-foreground flex-shrink-0" />
                        <p className="text-sm text-accent-foreground">
                          Demo mode - validation disabled
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              placeholder="Your name"
                              value={formData.name}
                              onChange={(e) => updateField('name', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="your@email.com"
                              value={formData.email}
                              onChange={(e) => updateField('email', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Select value={formData.subject} onValueChange={(value) => updateField('subject', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a topic" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General Enquiry</SelectItem>
                              <SelectItem value="support">Technical Support</SelectItem>
                              <SelectItem value="school">School Enquiry</SelectItem>
                              <SelectItem value="partnership">Partnership</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            placeholder="How can we help?"
                            rows={5}
                            value={formData.message}
                            onChange={(e) => updateField('message', e.target.value)}
                          />
                        </div>

                        <Button
                          type="submit"
                          size="lg"
                          className="w-full gradient-primary text-primary-foreground hover:opacity-90"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            'Sending...'
                          ) : (
                            <>
                              <Send className="w-5 h-5 mr-2" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    </>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-semibold text-foreground mb-4">Contact Info</h3>
                  <ul className="space-y-4">
                    <li>
                      <a 
                        href="mailto:hello@studybug.io" 
                        className="flex items-start gap-3 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-foreground">Email</div>
                          <div>hello@studybug.io</div>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a 
                        href="tel:+442012345678" 
                        className="flex items-start gap-3 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Phone className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-foreground">Phone</div>
                          <div>+44 20 1234 5678</div>
                        </div>
                      </a>
                    </li>
                    <li className="flex items-start gap-3 text-muted-foreground">
                      <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-foreground">Location</div>
                        <div>Flintshire, UK</div>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-semibold text-foreground mb-4">Support Hours</h3>
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-foreground">Mon - Fri</div>
                      <div>9am - 5pm GMT</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
