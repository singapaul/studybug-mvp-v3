import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getMyGroups, createGroup } from '@/services/supabase/group.service';
import { Group } from '@/types/group';
import { CreateGroupFormData } from '@/schemas/group.schema';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CreateGroupForm } from '@/components/groups/CreateGroupForm';
import { GroupCard } from '@/components/groups/GroupCard';
import { Plus, Users, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function Groups() {
  const { session } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    if (!session?.tutor) return;

    try {
      setIsLoading(true);
      const data = await getMyGroups(session.tutor.id);
      setGroups(data);
    } catch (error) {
      console.error('Error loading groups:', error);
      toast.error('Failed to load groups');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGroup = async (data: CreateGroupFormData) => {
    if (!session?.tutor) return;

    try {
      setIsCreating(true);
      const newGroup = await createGroup(session.tutor.id, data);
      setGroups([newGroup, ...groups]);
      setIsDialogOpen(false);
      toast.success(`Group "${newGroup.name}" created successfully!`);
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Groups</h1>
              <p className="text-muted-foreground mt-1">
                Manage your classes and student groups
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create New Group</DialogTitle>
                  <DialogDescription>
                    Create a new class or student group. Students can join using the
                    generated join code.
                  </DialogDescription>
                </DialogHeader>
                <CreateGroupForm onSubmit={handleCreateGroup} isLoading={isCreating} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : groups.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="rounded-full bg-muted p-6 mb-6">
              <Users className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No groups yet</h2>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Create your first class or student group to start organizing and managing
              your students. Each group gets a unique join code.
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Group
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create New Group</DialogTitle>
                  <DialogDescription>
                    Create a new class or student group. Students can join using the
                    generated join code.
                  </DialogDescription>
                </DialogHeader>
                <CreateGroupForm onSubmit={handleCreateGroup} isLoading={isCreating} />
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          // Groups Grid
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
