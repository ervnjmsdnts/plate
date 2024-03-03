'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function VisitorForm() {
  return (
    <div className='space-y-2'>
      <Input placeholder='Full Name' />
      <Input placeholder='Address' />
      <Input placeholder='Contact No.' />
      <Button className='w-full'>Submit</Button>
    </div>
  );
}
