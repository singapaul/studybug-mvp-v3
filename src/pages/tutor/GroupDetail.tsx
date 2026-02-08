import { AssignGameDialog } from '@/components/groups/AssignGameDialog';
import { InviteStudentsDialog } from '@/components/groups/InviteStudentsDialog';
import DashboardLayout from '@/components/layout/DashboardLayout';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatJoinCode, getJoinLink } from '@/lib/join-code';
import { deleteAssignment } from '@/services/supabase/assignment.service';
import { getGroupById, removeStudentFromGroup } from '@/services/supabase/group.service';
import { GroupWithDetails } from '@/types/group';
import {
  ArrowLeft,
  Calendar,
  Check,
  Copy,
  Gamepad2,
  Link as LinkIcon,
  Loader2,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function GroupDetail() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  const [group, setGroup] = useState<GroupWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [assignGameDialogOpen, setAssignGameDialogOpen] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState<string | null>(null);
  const [assignmentToRemove, setAssignmentToRemove] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    loadGroup();
  }, [groupId]);

  const loadGroup = async () => {
    if (!groupId) return;

    try {
      setIsLoading(true);
      const data = await getGroupById(groupId);
      if (!data) {
        toast.error('Group not found');
        navigate('/tutor/groups');
        return;
      }
      setGroup(data);
    } catch (error) {
      console.error('Error loading group:', error);
      toast.error('Failed to load group details');
    } finally {
      setIsLoading(false);
    }
  };

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
      toast.success(`${type === 'code' ? 'Join code' : 'Link'} copied!`);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleRemoveStudent = async () => {
    if (!studentToRemove || !groupId) return;

    try {
      setIsRemoving(true);
      await removeStudentFromGroup(groupId, studentToRemove);
      await loadGroup();
      toast.success('Student removed from group');
      setStudentToRemove(null);
    } catch (error) {
      console.error('Error removing student:', error);
      toast.error('Failed to remove student');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleRemoveAssignment = async () => {
    if (!assignmentToRemove) return;

    try {
      setIsRemoving(true);
      await deleteAssignment(assignmentToRemove);
      await loadGroup();
      toast.success('Game assignment removed');
      setAssignmentToRemove(null);
    } catch (error) {
      console.error('Error removing assignment:', error);
      toast.error('Failed to remove assignment');
    } finally {
      setIsRemoving(false);
    }
  };

  // Dev helper: Add mock student
  // Removed - use the Join Group flow instead
  // const addMockStudent = async () => {
  //   Students should join groups using the join code via JoinGroupDialog
  // };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!group) {
    return null;
  }

  const joinLink = getJoinLink(group.joinCode);
  const formattedCode = formatJoinCode(group.joinCode);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={() => navigate('/tutor/groups')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Groups
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{group.name}</h1>
              <div className="flex flex-wrap gap-2 mt-3">
                {group.ageRange && <Badge variant="secondary">{group.ageRange}</Badge>}
                {group.subjectArea && <Badge variant="outline">{group.subjectArea}</Badge>}
                <Badge variant="outline">
                  {group.members.length} {group.members.length === 1 ? 'student' : 'students'}
                </Badge>
              </div>
            </div>

            <Button size="lg" onClick={() => setInviteDialogOpen(true)}>
              <UserPlus className="mr-2 h-5 w-5" />
              Invite Students
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Join Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Join Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Join Code */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Join Code</label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={formattedCode}
                      readOnly
                      className="w-full px-4 py-2 border rounded-md font-mono text-xl font-bold text-center tracking-wider bg-muted"
                    />
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyToClipboard(group.joinCode, 'code')}
                  >
                    {copiedCode ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Shareable Link */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Shareable Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={joinLink}
                    readOnly
                    className="flex-1 px-4 py-2 border rounded-md font-mono text-sm bg-muted"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyToClipboard(joinLink, 'link')}
                  >
                    {copiedLink ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Share the join code or link with students to let them join this group
            </p>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Students Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Students ({group.members.length})
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {group.members.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No students have joined yet. Share the join code to invite students.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {group.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{member.student.user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined {new Date(member.joinedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setStudentToRemove(member.studentId)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assigned Games Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5" />
                  Assigned Games ({group.assignments.length})
                </CardTitle>
                <Button size="sm" variant="outline" onClick={() => setAssignGameDialogOpen(true)}>
                  <Gamepad2 className="mr-2 h-4 w-4" />
                  Assign Game
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {group.assignments.length === 0 ? (
                <div className="text-center py-8">
                  <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-4">
                    No games assigned yet. Assign a game to this group so students can play.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {group.assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{assignment.game.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-xs text-muted-foreground">
                            {assignment.game.gameType}
                          </p>
                          {assignment.dueDate && (
                            <Badge variant="outline" className="text-xs">
                              <Calendar className="mr-1 h-3 w-3" />
                              Due {new Date(assignment.dueDate).toLocaleDateString()}
                            </Badge>
                          )}
                          {assignment.passPercentage && (
                            <Badge variant="secondary" className="text-xs">
                              Pass: {assignment.passPercentage}%
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setAssignmentToRemove(assignment.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invite Students Dialog */}
      <InviteStudentsDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        groupName={group.name}
        joinCode={group.joinCode}
      />

      {/* Assign Game Dialog */}
      <AssignGameDialog
        open={assignGameDialogOpen}
        onOpenChange={setAssignGameDialogOpen}
        groupId={group.id}
        groupName={group.name}
        existingGameIds={group.assignments.map((a) => a.gameId)}
        onAssignmentCreated={loadGroup}
      />

      {/* Remove Student Confirmation */}
      <AlertDialog
        open={studentToRemove !== null}
        onOpenChange={(open) => !open && setStudentToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this student from the group? They will need to rejoin
              using the join code if they want to access this group again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveStudent}
              disabled={isRemoving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRemoving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Remove Student
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove Assignment Confirmation */}
      <AlertDialog
        open={assignmentToRemove !== null}
        onOpenChange={(open) => !open && setAssignmentToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Game Assignment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this game assignment? Students will no longer see this
              game in their assignments list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveAssignment}
              disabled={isRemoving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRemoving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Remove Assignment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
