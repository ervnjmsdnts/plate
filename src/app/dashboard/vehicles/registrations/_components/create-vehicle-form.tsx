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
import { ref, set } from 'firebase/database';
import { db } from '@/firebase';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';

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
  paymentDueDate: z.date({ required_error: 'Payment due date is required' }),
});

type Schema = z.infer<typeof schema>;

export default function CreateVehicleForm({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const { toast } = useToast();

  const onSubmit = async (data: Schema) => {
    try {
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() + 1);
      await set(ref(db, 'Registered Vehicles/' + uuidv4()), {
        ...data,
        dateRegistered: new Date().getTime(),
        paymentDueDate: data.paymentDueDate.getTime(),
        isActive: true,
      });
      form.reset({
        category: '',
        name: '',
        paymentDueDate: undefined,
        paymentName: '',
        paymentStatus: '',
        plateNumber: '',
      });
      onClose();
      toast({ title: 'Vehicle has been registered successfully' });
    } catch (_) {
      toast({ title: 'Error registering vehicle', variant: 'destructive' });
    }
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
            <FormField
              control={form.control}
              name='paymentDueDate'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}>
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Payment Due Date</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value as any}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  onClick={() =>
                    form.reset({
                      category: '',
                      name: '',
                      paymentDueDate: undefined,
                      paymentName: '',
                      paymentStatus: '',
                      plateNumber: '',
                    })
                  }
                  type='button'
                  variant='outline'>
                  Cancel
                </Button>
              </DialogClose>
              <Button type='submit'>Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
