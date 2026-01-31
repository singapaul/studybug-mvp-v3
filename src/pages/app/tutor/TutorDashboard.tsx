import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDemoData } from '@/hooks/useDemoData';
import { useAuth } from '@/context/AuthContext';
import { Users, Gamepad2, ClipboardList, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function TutorDashboard() {
  const { user } = useAuth();
  const { classes, students, assignments, studentProgress, activityFeed, games } = useDemoData();

  // Calculate stats
  const totalClasses = classes.length;
  const totalStudents = new Set(classes.flatMap(c => c.studentIds)).size;
  const activeAssignments = assignments.filter(a => new Date(a.dueDate) >= new Date()).length;
  const completedProgress = studentProgress.filter(p => p.status === 'completed');
  const avgCompletionRate = studentProgress.length > 0 
    ? Math.round((completedProgress.length / studentProgress.length) * 100) 
    : 0;

  const stats = [
    { label: 'Total Classes', value: totalClasses, icon: Users, color: 'text-secondary' },
    { label: 'Total Students', value: totalStudents, icon: Users, color: 'text-primary' },
    { label: 'Active Assignments', value: activeAssignments, icon: ClipboardList, color: 'text-accent-foreground' },
    { label: 'Avg Completion', value: `${avgCompletionRate}%`, icon: TrendingUp, color: 'text-coral' },
  ];

  const quickActions = [
    { 
      title: 'Create a Class', 
      description: 'Add a new class and invite students', 
      icon: Users, 
      href: '/app/tutor/classes/create',
      color: 'bg-secondary/10 text-secondary' 
    },
    { 
      title: 'Create a Game', 
      description: 'Build a custom revision game', 
      icon: Gamepad2, 
      href: '/app/tutor/games/create',
      color: 'bg-primary/10 text-primary' 
    },
    { 
      title: 'Create Assignment', 
      description: 'Assign a game to your class', 
      icon: ClipboardList, 
      href: '/app/tutor/assignments/create',
      color: 'bg-accent text-accent-foreground' 
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-muted-foreground">Here's what's happening with your classes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Card key={action.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center mb-3`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{action.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to={action.href}>
                    <Plus className="w-4 h-4 mr-2" />
                    {action.title.replace('Create ', '')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {activityFeed.slice(0, 6).map((activity) => (
                <div key={activity.id} className="p-4 flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'assignment-completed' ? 'bg-primary/10 text-primary' :
                    activity.type === 'student-joined' ? 'bg-secondary/10 text-secondary' :
                    activity.type === 'assignment-created' ? 'bg-accent text-accent-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {activity.type === 'assignment-completed' && <TrendingUp className="w-4 h-4" />}
                    {activity.type === 'student-joined' && <Users className="w-4 h-4" />}
                    {activity.type === 'assignment-created' && <ClipboardList className="w-4 h-4" />}
                    {activity.type === 'class-created' && <Users className="w-4 h-4" />}
                    {activity.type === 'game-created' && <Gamepad2 className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-dashed">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">View all {games.length} games</p>
              <p className="text-sm text-muted-foreground">Manage your revision games</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/app/tutor/games">
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-dashed">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">View all {assignments.length} assignments</p>
              <p className="text-sm text-muted-foreground">Track student progress</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/app/tutor/assignments">
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
