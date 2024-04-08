import { PropsWithChildren } from 'react';
import Sidebar from '@/components/sidebar';
import { getTokens } from 'next-firebase-auth-edge';
import { cookies } from 'next/headers';
import { clientConfig, serverConfig } from '@/config';
import { notFound } from 'next/navigation';

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const tokens = await getTokens(cookies(), {
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });

  if (!tokens) {
    notFound();
  }
  return (
    <div className='h-full bg-gray-100 w-full flex'>
      <Sidebar />
      <main className='my-4 mr-4 p-4 border rounded-md w-full bg-white'>
        {children}
      </main>
    </div>
  );
}
