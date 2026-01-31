import { Group } from '@/types/group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Gamepad2, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GroupCardProps {
  group: Group;
}

export function GroupCard({ group }: GroupCardProps) {
  const navigate = useNavigate();
  const memberCount = group._count?.members || 0;
  const assignmentCount = group._count?.assignments || 0;

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-xl group-hover:text-primary transition-colors">
              {group.name}
            </CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
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
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{memberCount}</span>
            <span className="text-muted-foreground">
              {memberCount === 1 ? 'student' : 'students'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Gamepad2 className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{assignmentCount}</span>
            <span className="text-muted-foreground">
              {assignmentCount === 1 ? 'game' : 'games'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {new Date(group.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Join Code */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Join Code:</span>
            <code className="px-2 py-1 bg-muted rounded text-sm font-mono font-semibold">
              {group.joinCode}
            </code>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/tutor/groups/${group.id}`)}
            className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          >
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
