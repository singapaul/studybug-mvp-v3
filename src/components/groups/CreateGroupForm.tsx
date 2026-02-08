import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createGroupSchema, CreateGroupFormData } from '@/schemas/group.schema';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface CreateGroupFormProps {
  onSubmit: (data: CreateGroupFormData) => Promise<void>;
  isLoading?: boolean;
}

export function CreateGroupForm({ onSubmit, isLoading }: CreateGroupFormProps) {
  const form = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: '',
      ageRange: '',
      subjectArea: '',
    },
  });

  const handleSubmit = async (data: CreateGroupFormData) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Year 5 Mathematics" {...field} disabled={isLoading} />
              </FormControl>
              <FormDescription>Choose a descriptive name for your class or group</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ageRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age Range</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 9-10 years" {...field} disabled={isLoading} />
              </FormControl>
              <FormDescription>Optional: Specify the age range of students</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subjectArea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject Area</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Mathematics, English, Science"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>Optional: Main subject or topic focus</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => form.reset()} disabled={isLoading}>
            Reset
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Group
          </Button>
        </div>
      </form>
    </Form>
  );
}
