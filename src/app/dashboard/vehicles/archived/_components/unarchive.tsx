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
import { db } from '@/firebase';
import { ref, update } from 'firebase/database';

interface RegisteredVehiclesType {
  id: string;
  name: string;
  plateNumber: string;
  category: 'HOMEOWNER' | 'VISITOR';
  paymentName: string;
  paymentStatus: 'PAID' | 'UNPAID';
  paymentDueDate: number;
  dateRegistered: number;
  isActive: boolean;
}

export default function UnarchiveVehicle({
  open,
  onClose,
  vehicle,
}: {
  open: boolean;
  onClose: () => void;
  vehicle: RegisteredVehiclesType;
}) {
  const { toast } = useToast();
  const unarchiveVehicle = async () => {
    try {
      await update(ref(db), {
        ['/Registered Vehicles/' + vehicle.id]: {
          ...vehicle,
          isActive: true,
          id: null,
        },
      });
      onClose();
      toast({ title: 'Vehicle has been unarchived successfully' });
    } catch (_) {
      toast({ title: 'Error unarchiving vehicle', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unarchive Vehicle</DialogTitle>
        </DialogHeader>
        <div>
          <p>Are you sure you want to unarchive this vehicle?</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='outline'>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={unarchiveVehicle}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
