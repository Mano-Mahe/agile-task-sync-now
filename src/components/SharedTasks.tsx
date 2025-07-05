
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Share2 } from "lucide-react";
import { Task } from "@/pages/Index";

interface SharedTasksProps {
  tasks: Task[];
}

export const SharedTasks = ({ tasks }: SharedTasksProps) => {
  if (tasks.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Shared Tasks</CardTitle>
          <Share2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-gray-500">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No shared tasks</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Shared Tasks</CardTitle>
        <Share2 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.slice(0, 3).map((task) => (
            <div key={task.id} className="flex items-start space-x-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{task.title}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Users className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {task.sharedWith?.length || 0} collaborators
                  </span>
                </div>
              </div>
              <Badge 
                variant={task.completed ? "secondary" : "outline"}
                className="text-xs"
              >
                {task.completed ? "Done" : "Active"}
              </Badge>
            </div>
          ))}
          
          {tasks.length > 3 && (
            <p className="text-xs text-gray-500 text-center pt-2">
              +{tasks.length - 3} more shared tasks
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
