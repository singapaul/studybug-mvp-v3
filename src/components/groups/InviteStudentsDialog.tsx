import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, Mail, Link as LinkIcon } from 'lucide-react';
import { formatJoinCode, getJoinLink } from '@/lib/join-code';
import { toast } from 'sonner';

interface InviteStudentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupName: string;
  joinCode: string;
}

export function InviteStudentsDialog({
  open,
  onOpenChange,
  groupName,
  joinCode,
}: InviteStudentsDialogProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
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
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Invite Students to {groupName}</DialogTitle>
          <DialogDescription>
            Share the join code or link with your students to let them join this group
          </DialogDescription>
        </DialogHeader>

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
              <li>Enter the join code: <span className="font-mono font-semibold">{formattedCode}</span></li>
              <li>Click "Join Group" to enroll</li>
            </ol>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
