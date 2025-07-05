
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, Calendar, CheckCircle } from "lucide-react";
import { TaskList } from "@/components/TaskList";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import { AuthDialog } from "@/components/AuthDialog";
import { TaskStats } from "@/components/TaskStats";
import { SharedTasks } from "@/components/SharedTasks";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags: string[];
  createdAt: string;
  sharedWith?: string[];
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);

  // Mock user for demo - replace with actual Supabase auth
  useEffect(() => {
    // Simulate logged in user
    setUser({ id: '1', email: 'demo@example.com', name: 'Demo User' });
    
    // Load mock tasks
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Complete hackathon project',
        description: 'Build a full-stack todo application',
        completed: false,
        priority: 'high',
        dueDate: '2024-07-10',
        tags: ['hackathon', 'coding'],
        createdAt: '2024-07-05T10:00:00Z',
        sharedWith: ['user2@example.com']
      },
      {
        id: '2',
        title: 'Review project requirements',
        completed: true,
        priority: 'medium',
        tags: ['planning'],
        createdAt: '2024-07-05T09:00:00Z'
      },
      {
        id: '3',
        title: 'Setup development environment',
        completed: true,
        priority: 'high',
        tags: ['setup'],
        createdAt: '2024-07-05T08:00:00Z'
      }
    ];
    setTasks(mockTasks);
  }, []);

  const handleCreateTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [task, ...prev]);
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">TaskFlow</CardTitle>
            <CardDescription>Collaborative Todo Management</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setIsAuthDialogOpen(true)}
              className="w-full"
            >
              Sign In to Get Started
            </Button>
          </CardContent>
        </Card>
        <AuthDialog 
          isOpen={isAuthDialogOpen}
          onClose={() => setIsAuthDialogOpen(false)}
          onLogin={setUser}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>Welcome, {user.name}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUser(null)}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Stats and Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <TaskStats tasks={tasks} />
            <SharedTasks tasks={tasks.filter(task => task.sharedWith?.length)} />
          </div>

          {/* Main Task List */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5" />
                      <span>My Tasks</span>
                    </CardTitle>
                    <CardDescription>
                      Manage your tasks and collaborate with others
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TaskList
                  tasks={tasks}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Dialogs */}
      <CreateTaskDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreateTask={handleCreateTask}
      />
    </div>
  );
};

export default Index;
