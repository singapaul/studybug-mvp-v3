import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Save,
  Loader2,
  Upload,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

export default function TutorSettings() {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Profile Settings
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Notification Settings
  const [completionNotifications, setCompletionNotifications] = useState(true);
  const [weeklyProgressSummary, setWeeklyProgressSummary] = useState(false);

  // Theme Settings
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  // Contact Support
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [isSendingSupport, setIsSendingSupport] = useState(false);

  useEffect(() => {
    // Load user settings from session/localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setDisplayName(settings.displayName || '');
        setBio(settings.bio || '');
        setAvatarUrl(settings.avatarUrl || '');
        setCompletionNotifications(settings.completionNotifications ?? true);
        setWeeklyProgressSummary(settings.weeklyProgressSummary ?? false);
        setTheme(settings.theme || 'system');
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  const handleTabChange = (newTab: string) => {
    if (hasUnsavedChanges) {
      setPendingTab(newTab);
      setShowUnsavedDialog(true);
    } else {
      setActiveTab(newTab);
    }
  };

  const handleDiscardChanges = () => {
    setHasUnsavedChanges(false);
    setShowUnsavedDialog(false);
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage for now (will be API call later)
      const settings = {
        displayName,
        bio,
        avatarUrl,
        completionNotifications,
        weeklyProgressSummary,
        theme,
      };
      localStorage.setItem('userSettings', JSON.stringify(settings));

      setHasUnsavedChanges(false);
      toast.success('Profile settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    try {
      const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
      settings.completionNotifications = completionNotifications;
      settings.weeklyProgressSummary = weeklyProgressSummary;
      localStorage.setItem('userSettings', JSON.stringify(settings));

      setHasUnsavedChanges(false);
      toast.success('Notification preferences saved!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveTheme = async () => {
    setIsSaving(true);
    try {
      const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
      settings.theme = theme;
      localStorage.setItem('userSettings', JSON.stringify(settings));

      setHasUnsavedChanges(false);
      toast.success('Theme preference saved!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // TODO: Implement actual upload to /public/avatars with crop/resize
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        setHasUnsavedChanges(true);
      };
      reader.readAsDataURL(file);
      toast.info('Avatar upload will be fully implemented with backend');
    }
  };

  const handleSendSupport = async () => {
    if (!supportSubject.trim() || !supportMessage.trim()) {
      toast.error('Please fill in both subject and message');
      return;
    }

    setIsSendingSupport(true);
    try {
      // TODO: Implement actual email sending
      console.log('Support request:', { supportSubject, supportMessage });
      toast.success('Support request sent! We will get back to you soon.');
      setSupportSubject('');
      setSupportMessage('');
    } catch (error) {
      console.error('Failed to send support request:', error);
      toast.error('Failed to send support request');
    } finally {
      setIsSendingSupport(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your profile information and avatar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Upload */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="h-24 w-24 rounded-full object-cover border-2"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold border-2">
                        {session?.user.email.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="avatar" className="cursor-pointer">
                      <div className="flex items-center gap-2 text-sm font-medium mb-2">
                        <Upload className="h-4 w-4" />
                        Change Avatar
                      </div>
                    </Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG or GIF. Max 2MB. Will be cropped to square.
                    </p>
                  </div>
                </div>

                {/* Display Name */}
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    placeholder="Enter your display name"
                    maxLength={50}
                  />
                  <p className="text-xs text-muted-foreground">
                    This is how your name appears to students
                  </p>
                </div>

                {/* Email (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={session?.user.email || ''}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email changes will be available in a future update
                  </p>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio (Optional)</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => {
                      setBio(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    placeholder="Tell students a bit about yourself..."
                    maxLength={500}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    {bio.length}/500 characters
                  </p>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={isSaving || !hasUnsavedChanges}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Settings Tab */}
          <TabsContent value="account" className="space-y-6">
            {/* Password Change (Placeholder) */}
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Update your password</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-dashed border-muted-foreground/25 p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Password management will be available once authentication is fully integrated
                  </p>
                  <Button variant="outline" disabled>
                    Change Password (Coming Soon)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Manage your email notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="completion-notifs" className="text-base">
                      Student Completion Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when students complete assignments
                    </p>
                  </div>
                  <Switch
                    id="completion-notifs"
                    checked={completionNotifications}
                    onCheckedChange={(checked) => {
                      setCompletionNotifications(checked);
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="weekly-summary" className="text-base">
                      Weekly Progress Summary
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a weekly summary of student progress
                    </p>
                  </div>
                  <Switch
                    id="weekly-summary"
                    checked={weeklyProgressSummary}
                    onCheckedChange={(checked) => {
                      setWeeklyProgressSummary(checked);
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveNotifications}
                    disabled={isSaving || !hasUnsavedChanges}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Theme Preference */}
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how StudyBug looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      onClick={() => {
                        setTheme('light');
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full"
                    >
                      Light
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      onClick={() => {
                        setTheme('dark');
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full"
                    >
                      Dark
                    </Button>
                    <Button
                      variant={theme === 'system' ? 'default' : 'outline'}
                      onClick={() => {
                        setTheme('system');
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full"
                    >
                      System
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Note: Theme switching will be fully functional in a future update
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveTheme} disabled={isSaving || !hasUnsavedChanges}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Theme
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>Manage your subscription and billing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                  <div>
                    <h3 className="font-semibold text-lg">Current Plan</h3>
                    <p className="text-sm text-muted-foreground">Free Trial</p>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    Active
                  </Badge>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Upgrade options and billing management coming soon!
                  </p>
                  <Button variant="outline" disabled>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Upgrade Plan (Coming Soon)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy & Legal Tab */}
          <TabsContent value="privacy" className="space-y-6">
            {/* Legal Links */}
            <Card>
              <CardHeader>
                <CardTitle>Legal & Privacy</CardTitle>
                <CardDescription>Review our terms and privacy policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-between" asChild>
                  <a href="/terms" target="_blank" rel="noopener noreferrer">
                    Terms of Service
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-between" asChild>
                  <a href="/privacy" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <div className="rounded-lg border p-4 bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    <Shield className="inline h-4 w-4 mr-1" />
                    Payments securely processed by Stripe (coming soon)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>Get help from our support team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="support-subject">Subject</Label>
                  <Input
                    id="support-subject"
                    value={supportSubject}
                    onChange={(e) => setSupportSubject(e.target.value)}
                    placeholder="Brief description of your issue"
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="support-message">Message</Label>
                  <Textarea
                    id="support-message"
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="Describe your issue in detail..."
                    rows={6}
                    maxLength={1000}
                  />
                  <p className="text-xs text-muted-foreground">
                    {supportMessage.length}/1000 characters
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Or email us directly at support@studybug.com
                  </p>
                </div>

                <Button
                  onClick={handleSendSupport}
                  disabled={isSendingSupport || !supportSubject.trim() || !supportMessage.trim()}
                  className="w-full"
                >
                  {isSendingSupport ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Unsaved Changes Dialog */}
        <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
              <AlertDialogDescription>
                You have unsaved changes. Are you sure you want to leave this page? Your changes
                will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowUnsavedDialog(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDiscardChanges}>
                Discard Changes
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
