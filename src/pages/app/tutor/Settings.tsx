import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [notifications, setNotifications] = useState({
    studentJoins: true,
    assignmentCompleted: true,
    assignmentDueSoon: false,
    weeklyReport: true,
  });

  const [contact, setContact] = useState({
    subject: '',
    message: '',
  });

  const handleSaveProfile = () => {
    toast({
      title: 'Demo mode',
      description: 'Profile changes are not saved in demo mode',
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Demo mode',
      description: 'Password changes are not saved in demo mode',
    });
    setPassword({ current: '', new: '', confirm: '' });
  };

  const handleSaveNotifications = () => {
    toast({
      title: 'Preferences saved',
      description: 'Your notification preferences have been updated',
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Message sent',
      description: 'We\'ll get back to you soon!',
    });
    setContact({ subject: '', message: '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Demo Notice */}
      <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <p className="text-sm text-amber-700">
          Demo mode - changes are not persisted
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-semibold text-primary">
                    {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Change Avatar
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>

              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current">Current Password</Label>
                  <Input
                    id="current"
                    type="password"
                    value={password.current}
                    onChange={(e) => setPassword({ ...password, current: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new">New Password</Label>
                  <Input
                    id="new"
                    type="password"
                    value={password.new}
                    onChange={(e) => setPassword({ ...password, new: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm New Password</Label>
                  <Input
                    id="confirm"
                    type="password"
                    value={password.confirm}
                    onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                  />
                </div>

                <Button type="submit">Change Password</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {[
                  { key: 'studentJoins', label: 'When a student joins my class' },
                  { key: 'assignmentCompleted', label: 'When a student completes an assignment' },
                  { key: 'assignmentDueSoon', label: 'Assignment due soon reminders' },
                  { key: 'weeklyReport', label: 'Weekly progress report' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center gap-3">
                    <Checkbox
                      id={item.key}
                      checked={notifications[item.key as keyof typeof notifications]}
                      onCheckedChange={(checked) => 
                        setNotifications({ ...notifications, [item.key]: checked })
                      }
                    />
                    <Label htmlFor={item.key} className="font-normal">
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>

              <Button onClick={handleSaveNotifications}>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="How can we help?"
                    value={contact.subject}
                    onChange={(e) => setContact({ ...contact, subject: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your issue or question..."
                    value={contact.message}
                    onChange={(e) => setContact({ ...contact, message: e.target.value })}
                    rows={5}
                  />
                </div>

                <Button type="submit">Send Message</Button>
              </form>

              <p className="text-sm text-muted-foreground mt-4">
                Or email us directly at{' '}
                <a href="mailto:hello@studybug.io" className="text-primary hover:underline">
                  hello@studybug.io
                </a>
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
