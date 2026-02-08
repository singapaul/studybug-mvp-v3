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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { joinGroup } from '@/services/supabase/student.service';

interface JoinGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
  studentEmail: string;
  onSuccess?: () => void;
}

export default function JoinGroupDialog({
  open,
  onOpenChange,
  studentId,
  studentEmail,
  onSuccess,
}: JoinGroupDialogProps) {
  const [joinCode, setJoinCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (joinCode.trim().length !== 6) {
      setError('Join code must be 6 characters');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await joinGroup(joinCode);

      if (result.success) {
        setSuccess(`Successfully joined ${result.groupName}!`);
        setJoinCode('');

        // Wait a moment to show success message
        setTimeout(() => {
          onSuccess?.();
          onOpenChange(false);
          setSuccess(null);
        }, 1500);
      } else {
        setError(result.error || 'Failed to join group');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (value: string) => {
    // Only allow alphanumeric characters and convert to uppercase
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (cleaned.length <= 6) {
      setJoinCode(cleaned);
      setError(null);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setJoinCode('');
      setError(null);
      setSuccess(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join a Group</DialogTitle>
          <DialogDescription>
            Enter the 6-character join code provided by your tutor to join a group.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleJoinGroup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="joinCode">Join Code</Label>
            <Input
              id="joinCode"
              placeholder="ABC123"
              value={joinCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              disabled={isLoading || !!success}
              className="text-center text-lg tracking-wider font-mono uppercase"
              maxLength={6}
              autoComplete="off"
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Join codes are 6 characters long and not case-sensitive
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 bg-green-50 text-green-900">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading || !!success}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || joinCode.length !== 6 || !!success}
              className="flex-1"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {success ? 'Joined!' : 'Join Group'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
