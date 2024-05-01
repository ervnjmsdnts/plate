import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { db } from '@/firebase';
import { child, get, ref } from 'firebase/database';
import { CarFront, NotepadText } from 'lucide-react';
import { unstable_noStore } from 'next/cache';
import { headers } from 'next/headers';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

function LoadingCard() {
  return (
    <Card>
      <CardHeader className='pb-2'></CardHeader>
      <CardContent>Loading...</CardContent>
    </Card>
  );
}

async function TotalRegisteredVehicles() {
  const dbRef = ref(db);
  const registeredVehicles = await get(child(dbRef, 'Registered Vehicles'));

  return (
    <Card>
      <CardHeader className='pb-2'>
        <CarFront className='text-muted-foreground h-6 w-6' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>
          {Object.entries(registeredVehicles.val()).length}
        </div>
        <p className='text-xs text-muted-foreground'>
          Total Registered Vehicles
        </p>
      </CardContent>
    </Card>
  );
}
async function TotalVehicleLogs() {
  const dbRef = ref(db);
  const registeredVehicles = await get(child(dbRef, 'Vehicle Logs'));

  return (
    <Card>
      <CardHeader className='pb-2'>
        <NotepadText className='text-muted-foreground h-6 w-6' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>
          {Object.entries(registeredVehicles.val()).length}
        </div>
        <p className='text-xs text-muted-foreground'>Total Vehicle Logs</p>
      </CardContent>
    </Card>
  );
}

async function TotalVisitorLogs() {
  const dbRef = ref(db);
  const registeredVehicles = await get(child(dbRef, 'Visitor Logs'));

  return (
    <Card>
      <CardHeader className='pb-2'>
        <NotepadText className='text-muted-foreground h-6 w-6' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>
          {Object.entries(registeredVehicles.val()).length}
        </div>
        <p className='text-xs text-muted-foreground'>Total Visitor Logs</p>
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  unstable_noStore();

  return (
    <div>
      <div className='grid grid-cols-3 gap-4'>
        <Suspense fallback={<LoadingCard />}>
          <TotalRegisteredVehicles />
        </Suspense>
        <Suspense fallback={<LoadingCard />}>
          <TotalVehicleLogs />
        </Suspense>
        <Suspense fallback={<LoadingCard />}>
          <TotalVisitorLogs />
        </Suspense>
      </div>
    </div>
  );
}
