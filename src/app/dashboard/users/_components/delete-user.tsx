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
import { useToast } from '@/components/ui/use-toast';

interface UsersType {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'GUARD';
  createdAt: number;
}

export default function DeleteUser({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user: UsersType;
}) {
  const { toast } = useToast();
  const deleteUser = async () => {
    try {
      const res = await fetch('/api/deleteUser', {
        body: JSON.stringify({ id: user.id }),
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
      });
      const data = await res.json();
      onClose();
      toast({ title: data.message });
    } catch (error) {
      toast({ title: (error as Error).message, variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
        </DialogHeader>
        <div>
          <p>Are you sure you want to remove this user?</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='outline'>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={deleteUser} variant={'destructive'}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
