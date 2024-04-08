import { PropsWithChildren } from 'react';
import Sidebar from '@/components/sidebar';
import { getTokens } from 'next-firebase-auth-edge';
import { cookies } from 'next/headers';
import { clientConfig, serverConfig } from '@/config';
import { notFound } from 'next/navigation';
import { child, get, ref } from 'firebase/database';
import { db } from '@/firebase';
import { UserType } from './types';

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

  const dbRef = ref(db);
  const userData = await get(child(dbRef, `Users/${tokens.decodedToken.uid}`));

  const user = userData.val() as UserType;

  return (
    <div className='h-full bg-gray-100 w-full flex'>
      <Sidebar {...user} />
      <main className='my-4 mr-4 p-4 border rounded-md w-full bg-white'>
        {children}
      </main>
    </div>
  );
}
