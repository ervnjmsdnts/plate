'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { auth, db } from '@/firebase';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ref, set, update } from 'firebase/database';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z
    .string({ required_error: 'Full name is required' })
    .min(1, 'Field is required'),
  role: z
    .string({ required_error: 'Role is required' })
    .min(1, 'Field is required'),
});

type Schema = z.infer<typeof schema>;

interface UsersType {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'GUARD';
  createdAt: number;
}

export default function EditUserForm({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user: UsersType;
}) {
  const [loading, setLoading] = useState(false);
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    values: { ...user },
  });

  const { toast } = useToast();

  const onSubmit = async (data: Schema) => {
    try {
      setLoading(true);
      await update(ref(db, 'Users/' + user.id), {
        name: data.name,
        role: data.role,
      });
      onClose();
      toast({ title: 'User has been updated successfully' });
    } catch (error) {
      toast({ title: (error as Error).message, variant: 'destructive' });
    } finally {
      setLoading(true);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder='Full Name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          field.value ? 'text-black' : 'text-muted-foreground',
                        )}>
                        <SelectValue placeholder='Role' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='ADMIN'>Admin</SelectItem>
                      <SelectItem value='GUARD'>Guard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type='button' variant='outline'>
                  Cancel
                </Button>
              </DialogClose>
              <Button type='submit' disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className='animate-spin w-4 h-4' /> Updating
                  </>
                ) : (
                  'Update'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
