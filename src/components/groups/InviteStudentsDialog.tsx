import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check, Mail, Link as LinkIcon, Send } from 'lucide-react';
import { formatJoinCode, getJoinLink } from '@/lib/join-code';
import { toast } from 'sonner';

interface InviteStudentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupName: string;
  joinCode: string;
  tutorName: string;
}

export function InviteStudentsDialog({
  open,
  onOpenChange,
  groupName,
  joinCode,
  tutorName,
}: InviteStudentsDialogProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [isSendingEmails, setIsSendingEmails] = useState(false);

  const joinLink = getJoinLink(joinCode);
  const formattedCode = formatJoinCode(joinCode);

  const copyToClipboard = async (text: string, type: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'code') {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
      toast.success(`${type === 'code' ? 'Join code' : 'Link'} copied to clipboard`);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleSendEmails = async () => {
    const rawEmails = emailInput
      .split(',')
      .map((e) => e.trim())
      .filter((e) => e.length > 0);

    if (rawEmails.length === 0) {
      toast.error('Please enter at least one email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = rawEmails.filter((e) => !emailRegex.test(e));
    if (invalidEmails.length > 0) {
      toast.error(`Invalid email address${invalidEmails.length > 1 ? 'es' : ''}: ${invalidEmails.join(', ')}`);
      return;
    }

    setIsSendingEmails(true);
    try {
      // Mock: group invite emails would be sent here in production
      console.log('Mock: send-group-invite', { emails: rawEmails, tutorName, groupName, joinCode });
      await new Promise((resolve) => setTimeout(resolve, 500));
      const sent = rawEmails.length;
      toast.success(`Invitation${sent !== 1 ? 's' : ''} sent to ${sent} email address${sent !== 1 ? 'es' : ''}`);
      setEmailInput('');
    } catch (err) {
      console.error('Failed to send group invites:', err);
      toast.error('Failed to send invitations. Please try again.');
    } finally {
      setIsSendingEmails(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Invite Students to {groupName}</DialogTitle>
          <DialogDescription>
            Share the join code, copy the link, or send email invitations directly
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="code" className="mt-2">
          <TabsList className="w-full">
            <TabsTrigger value="code" className="flex-1">Join Code & Link</TabsTrigger>
            <TabsTrigger value="email" className="flex-1">Invite by Email</TabsTrigger>
          </TabsList>

          {/* ── Tab 1: Join code & shareable link ── */}
          <TabsContent value="code">
            <div className="space-y-6 py-4">
              {/* Join Code Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-base font-semibold">Join Code</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Students can enter this code on the join page
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      value={formattedCode}
                      readOnly
                      className="font-mono text-2xl font-bold text-center tracking-wider pr-12"
                    />
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyToClipboard(joinCode, 'code')}
                    className="shrink-0"
                  >
                    {copiedCode ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or share link</span>
                </div>
              </div>

              {/* Shareable Link Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-base font-semibold">Shareable Link</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Send this link directly to students via email or messaging
                </p>
                <div className="flex gap-2">
                  <Input value={joinLink} readOnly className="font-mono text-sm" />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyToClipboard(joinLink, 'link')}
                    className="shrink-0"
                  >
                    {copiedLink ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Instructions */}
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <p className="text-sm font-medium">How students can join:</p>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Visit the join page or click the shareable link</li>
                  <li>
                    Enter the join code:{' '}
                    <span className="font-mono font-semibold">{formattedCode}</span>
                  </li>
                  <li>Click "Join Group" to enroll</li>
                </ol>
              </div>
            </div>
          </TabsContent>

          {/* ── Tab 2: Invite by email ── */}
          <TabsContent value="email">
            <div className="space-y-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="invite-emails" className="text-base font-semibold">
                  Email addresses
                </Label>
                <p className="text-sm text-muted-foreground">
                  Enter one or more email addresses separated by commas. Each person will receive a
                  personalised invite with the join code.
                </p>
                <Textarea
                  id="invite-emails"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="student1@example.com, student2@example.com"
                  rows={4}
                  className="font-mono text-sm"
                />
              </div>

              <div className="rounded-lg bg-muted p-4 space-y-1">
                <p className="text-sm font-medium">What recipients will receive:</p>
                <p className="text-sm text-muted-foreground">
                  A branded StudyBug email from your name with the join code{' '}
                  <span className="font-mono font-semibold">{formattedCode}</span> and instructions
                  to sign up and join <strong>{groupName}</strong>.
                </p>
              </div>

              <Button
                onClick={handleSendEmails}
                disabled={isSendingEmails || emailInput.trim().length === 0}
                className="w-full"
              >
                {isSendingEmails ? (
                  <>
                    <span className="mr-2 h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin inline-block" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Invitations
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
