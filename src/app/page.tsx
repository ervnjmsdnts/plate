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
import { auth, db } from '@/firebase';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { child, get, ref } from 'firebase/database';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { UserType } from './dashboard/types';

const schema = z.object({
  email: z
    .string({ required_error: 'Email address is required' })
    .min(1, 'Field is required'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Field is required'),
});

type Schema = z.infer<typeof schema>;

function parseJwt(token: string) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
}

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

      const tokenData = parseJwt(idToken);

      const user = await get(child(ref(db), 'Users/' + tokenData.user_id));

      const userData = user.val() as UserType;

      localStorage.setItem(
        'user',
        JSON.stringify({ role: userData.role, id: tokenData.user_id }),
      );

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
        <div className='flex items-center justify-center'>
          <div className='relative w-24 h-24'>
            <Image src='/logo-vmos.png' alt='Logo' layout='fill' />
          </div>
        </div>
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
