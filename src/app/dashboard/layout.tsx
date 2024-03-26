import { PropsWithChildren } from 'react';
import Sidebar from '@/components/sidebar';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className='h-full bg-gray-100 w-full flex'>
      <Sidebar />
      <main className='my-4 mr-4 p-4 border rounded-md w-full bg-white'>
        {children}
      </main>
    </div>
  );
}
