/**
 * Development-only component to quickly generate test data for student dashboard
 * Remove this from production builds
 */

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Database, Trash2, Plus } from 'lucide-react';
import { initializeStudentTestData, clearTestData } from '@/lib/test-data-utils';
import { toast } from 'sonner';

interface StudentTestDataButtonProps {
  studentId: string;
  onDataChanged?: () => void;
}

export function StudentTestDataButton({ studentId, onDataChanged }: StudentTestDataButtonProps) {
  // Only show in development
  if (import.meta.env.PROD) return null;

  const handleInitializeData = () => {
    try {
      initializeStudentTestData(studentId, 'dev_tutor_id');
      toast.success('Test data created!', {
        description: 'Created 3 games, 1 group, and 3 assignments',
      });
      onDataChanged?.();
    } catch (error) {
      toast.error('Failed to create test data');
      console.error(error);
    }
  };

  const handleClearData = () => {
    try {
      clearTestData();
      toast.success('Test data cleared');
      onDataChanged?.();
    } catch (error) {
      toast.error('Failed to clear test data');
      console.error(error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 left-4 z-50 shadow-lg border-2 border-dashed border-orange-500"
        >
          <Database className="mr-2 h-4 w-4" />
          Dev Tools
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" side="top">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">Student Test Data</h4>
            <p className="text-xs text-muted-foreground mb-3">
              Quickly create or clear test data for development
            </p>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleInitializeData}
              className="w-full"
              size="sm"
              variant="default"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Test Data
            </Button>

            <Button
              onClick={handleClearData}
              className="w-full"
              size="sm"
              variant="destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Test Data
            </Button>
          </div>

          <div className="text-xs text-muted-foreground border-t pt-3">
            <p className="font-medium mb-1">What gets created:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>3 test games</li>
              <li>1 group (code: TEST01)</li>
              <li>3 assignments</li>
              <li>1 game attempt</li>
            </ul>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
