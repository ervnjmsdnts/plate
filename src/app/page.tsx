'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { auth } from '@/firebase';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  email: z
    .string({ required_error: 'Email address is required' })
    .min(1, 'Field is required'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Field is required'),
});

type Schema = z.infer<typeof schema>;

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<Schema>({ resolver: zodResolver(schema) });
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data: Schema) => {
    try {
      setIsLoading(true);
      const credentials = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      const idToken = await credentials.user.getIdToken();

      await fetch('/api/login', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      router.refresh();
    } catch (_) {
      toast({ title: 'Invalid Credentials', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='h-screen w-screen flex items-center justify-center bg-primary'>
      <div className='bg-white flex flex-col gap-4 rounded-md p-4'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder='Email Address'
                      type='email'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder='Password' type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full' disabled={isLoading} type='submit'>
              {isLoading ? (
                <>
                  <Loader2 className='animate-spin h-4 w-4 mr-2' /> Logging In
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
