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
  Users,
  Save,
  Loader2,
  Upload,
  Mail,
  ExternalLink,
  UserX,
  MessageCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { getMyGroups } from '@/services/supabase/group.service';
import { GroupWithDetails } from '@/types/group';

export default function StudentSettings() {
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
  const [assignmentReminders, setAssignmentReminders] = useState(true);
  const [weeklyProgressSummary, setWeeklyProgressSummary] = useState(false);

  // Theme Settings
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  // Groups Management
  const [groups, setGroups] = useState<GroupWithDetails[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [groupToLeave, setGroupToLeave] = useState<string | null>(null);
  const [isLeavingGroup, setIsLeavingGroup] = useState(false);

  // Contact Support
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [isSendingSupport, setIsSendingSupport] = useState(false);

  useEffect(() => {
    // Load user settings
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setDisplayName(settings.displayName || '');
        setBio(settings.bio || '');
        setAvatarUrl(settings.avatarUrl || '');
        setAssignmentReminders(settings.assignmentReminders ?? true);
        setWeeklyProgressSummary(settings.weeklyProgressSummary ?? false);
        setTheme(settings.theme || 'system');
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }

    // Load student groups
    loadGroups();
  }, []);

  const loadGroups = async () => {
    if (!session?.student?.id) return;

    setIsLoadingGroups(true);
    try {
      const studentGroups = await getMyGroups(session.student.id);
      setGroups(studentGroups);
    } catch (error) {
      console.error('Failed to load groups:', error);
      toast.error('Failed to load groups');
    } finally {
      setIsLoadingGroups(false);
    }
  };

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
      const settings = {
        displayName,
        bio,
        avatarUrl,
        assignmentReminders,
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
      settings.assignmentReminders = assignmentReminders;
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        setHasUnsavedChanges(true);
      };
      reader.readAsDataURL(file);
      toast.info('Avatar upload will be fully implemented with backend');
    }
  };

  const handleLeaveGroup = async () => {
    if (!groupToLeave || !session?.student?.id) return;

    setIsLeavingGroup(true);
    try {
      // TODO: Implement actual leave group API call
      toast.success('Left group successfully');
      setGroupToLeave(null);
      await loadGroups();
    } catch (error) {
      console.error('Failed to leave group:', error);
      toast.error('Failed to leave group');
    } finally {
      setIsLeavingGroup(false);
    }
  };

  const handleContactTutor = (groupId: string) => {
    toast.info('Contact tutor feature will be implemented with messaging system');
  };

  const handleSendSupport = async () => {
    if (!supportSubject.trim() || !supportMessage.trim()) {
      toast.error('Please fill in both subject and message');
      return;
    }

    setIsSendingSupport(true);
    try {
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
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Groups</span>
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
                      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold border-2">
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
                    This is how your name appears to tutors
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
                    placeholder="Tell tutors a bit about yourself..."
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
                    <Label htmlFor="assignment-reminders" className="text-base">
                      Assignment Reminders
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Get reminded about upcoming assignment due dates
                    </p>
                  </div>
                  <Switch
                    id="assignment-reminders"
                    checked={assignmentReminders}
                    onCheckedChange={(checked) => {
                      setAssignmentReminders(checked);
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
                      Receive a weekly summary of your progress
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

          {/* Groups Management Tab */}
          <TabsContent value="groups" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Groups</CardTitle>
                <CardDescription>Manage your group memberships</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingGroups ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : groups.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground">
                      You haven't joined any groups yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {groups.map((group) => (
                      <div
                        key={group.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {group.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium">{group.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              {group.ageRange && (
                                <Badge variant="secondary" className="text-xs">
                                  {group.ageRange}
                                </Badge>
                              )}
                              {group.subjectArea && (
                                <Badge variant="outline" className="text-xs">
                                  {group.subjectArea}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleContactTutor(group.id)}
                          >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Contact Tutor
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setGroupToLeave(group.id)}
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            Leave
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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

        {/* Leave Group Confirmation Dialog */}
        <AlertDialog open={groupToLeave !== null} onOpenChange={(open) => !open && setGroupToLeave(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Leave Group</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to leave this group? You will need to use the join code again to rejoin.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLeavingGroup}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLeaveGroup}
                disabled={isLeavingGroup}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isLeavingGroup && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Leave Group
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
