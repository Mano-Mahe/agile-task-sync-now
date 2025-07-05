
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Mail, Users } from "lucide-react";
import { Task } from "@/pages/Index";
import { toast } from "@/hooks/use-toast";

interface ShareTaskDialogProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

export const ShareTaskDialog = ({ task, isOpen, onClose, onUpdateTask }: ShareTaskDialogProps) => {
  const [emailInput, setEmailInput] = useState("");
  const [sharedWith, setSharedWith] = useState<string[]>(task.sharedWith || []);

  const handleAddEmail = () => {
    const email = emailInput.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) return;
    
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    if (sharedWith.includes(email)) {
      toast({
        title: "Already shared",
        description: "This task is already shared with this email.",
        variant: "destructive",
      });
      return;
    }

    setSharedWith([...sharedWith, email]);
    setEmailInput("");
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setSharedWith(sharedWith.filter(email => email !== emailToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleSave = () => {
    onUpdateTask(task.id, { sharedWith });
    toast({
      title: "Task sharing updated",
      description: `Task is now shared with ${sharedWith.length} people.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Share Task
          </DialogTitle>
          <DialogDescription>
            Share "{task.title}" with others to collaborate.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Add collaborators by email</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter email address..."
              />
              <Button type="button" variant="outline" onClick={handleAddEmail}>
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {sharedWith.length > 0 && (
            <div className="grid gap-2">
              <Label>Shared with ({sharedWith.length})</Label>
              <div className="flex flex-wrap gap-2">
                {sharedWith.map((email) => (
                  <Badge key={email} variant="secondary" className="flex items-center gap-1">
                    {email}
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(email)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {sharedWith.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No collaborators yet</p>
              <p className="text-sm">Add email addresses to share this task</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
