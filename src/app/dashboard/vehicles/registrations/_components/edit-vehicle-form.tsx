'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ref, update } from 'firebase/database';
import { db } from '@/firebase';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

const schema = z.object({
  name: z
    .string({ required_error: 'Full name is required' })
    .min(1, { message: 'Full name is required' }),
  plateNumber: z
    .string({ required_error: 'Plate number is required' })
    .min(1, { message: 'Plate number is required' }),
  category: z
    .string({ required_error: 'Category is required' })
    .min(1, { message: 'Category is required' }),
  paymentName: z
    .string({ required_error: 'Payment name is required' })
    .min(1, { message: 'Payment name is required' }),
  paymentStatus: z
    .string({ required_error: 'Payment status is required' })
    .min(1, { message: 'Payment status is required' }),
});

type Schema = z.infer<typeof schema>;

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

export default function EditVehicleForm({
  open,
  onClose,
  vehicle,
}: {
  open: boolean;
  onClose: () => void;
  vehicle: RegisteredVehiclesType;
}) {
  const [paymentDueDate, setPaymentDueDate] = useState(0);
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    values: { ...vehicle },
  });

  const { toast } = useToast();

  useEffect(() => {
    if (vehicle.paymentDueDate) {
      setPaymentDueDate(vehicle.paymentDueDate);
    }
  }, [vehicle.paymentDueDate]);

  const onSubmit = async (data: Schema) => {
    try {
      await update(ref(db), {
        ['/Registered Vehicles/' + vehicle.id]: {
          ...vehicle,
          ...data,
          paymentDueDate,
          id: null,
        },
      });
      onClose();
      toast({ title: 'Vehicle has been updated successfully' });
    } catch (_) {
      toast({ title: 'Error editing vehicle', variant: 'destructive' });
    }
  };

  const setNewDueDate = () => {
    const date = new Date(paymentDueDate);
    date.setMonth(date.getMonth() + 1);
    setPaymentDueDate(date.getTime());
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register Car</DialogTitle>
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
              name='plateNumber'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder='Plate Number' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='category'
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
                        <SelectValue placeholder='Category' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='HOMEOWNER'>Homeowner</SelectItem>
                      <SelectItem value='VISITOR'>Visitor</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='paymentName'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder='Payment Name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='paymentStatus'
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
                        <SelectValue placeholder='Payment Status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='PAID'>Paid</SelectItem>
                      <SelectItem value='UNPAID'>Not Paid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {paymentDueDate && (
              <div className='flex gap-2 items-center'>
                <p className='text-sm'>
                  Payment Due Date: {format(paymentDueDate, 'P')}
                </p>
                <Button
                  type='button'
                  onClick={setNewDueDate}
                  size='sm'
                  variant='secondary'>
                  New Due Date
                </Button>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type='button' variant='outline'>
                  Cancel
                </Button>
              </DialogClose>
              <Button type='submit'>Update</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
