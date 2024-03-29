'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import QRCode from 'qrcode';
import Image from 'next/image';

const schema = z.object({
  name: z.string().min(1, { message: 'Full name is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  contactNum: z.string().min(1, { message: 'Contact Number is required' }),
});

type Schema = z.infer<typeof schema>;

export default function VisitorForm() {
  const [open, setOpen] = useState(false);
  const [qrData, setQrData] = useState('');
  const form = useForm<Schema>({ resolver: zodResolver(schema) });

  const onSubmit = (data: Schema) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 5);
    QRCode.toDataURL(
      JSON.stringify({ ...data, expirationTime: currentDate.getTime() }),
    ).then(setQrData);
    setOpen(true);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='w-64'>
          <DialogHeader>
            <DialogTitle>Generated QR Code</DialogTitle>
          </DialogHeader>
          <div className='flex items-center justify-center'>
            <div className='relative w-32 h-32'>
              <Image src={qrData} alt='QR Data' fill />
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
            name='address'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder='Address' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='contactNum'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder='Contact Number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className='w-full' type='submit'>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
