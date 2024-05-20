'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { db } from '@/firebase';
import { onValue, ref } from 'firebase/database';
import { CarFront, NotepadText } from 'lucide-react';
import { useEffect, useState } from 'react';

export const dynamic = 'force-dynamic';

function LoadingCard() {
  return (
    <Card>
      <CardHeader className='pb-2'></CardHeader>
      <CardContent>Loading...</CardContent>
    </Card>
  );
}

function TotalRegisteredVehicles() {
  const [registeredVehicles, setRegisteredVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = ref(db, 'Registered Vehicles');
    const unsubscribe = onValue(query, (snapshot) => {
      const data = snapshot.val();

      if (snapshot.exists()) {
        const logsWithIds = Object.entries(data).map(
          ([id, log]: [string, any]) => ({
            id,
            ...log,
          }),
        );
        setRegisteredVehicles(logsWithIds);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      {loading ? (
        <LoadingCard />
      ) : (
        <Card>
          <CardHeader className='pb-2'>
            <CarFront className='text-muted-foreground h-6 w-6' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {registeredVehicles.length}
            </div>
            <p className='text-xs text-muted-foreground'>
              Total Registered Vehicles
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
function TotalVehicleLogs() {
  const [vehicleLogs, setVehicleLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = ref(db, 'Vehicle Logs');
    const unsubscribe = onValue(query, (snapshot) => {
      const data = snapshot.val();

      if (snapshot.exists()) {
        const logsWithIds = Object.entries(data).map(
          ([id, log]: [string, any]) => ({
            id,
            ...log,
          }),
        );
        setVehicleLogs(logsWithIds);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      {loading ? (
        <LoadingCard />
      ) : (
        <Card>
          <CardHeader className='pb-2'>
            <NotepadText className='text-muted-foreground h-6 w-6' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{vehicleLogs.length}</div>
            <p className='text-xs text-muted-foreground'>Total Vehicle Logs</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}

function TotalVisitorLogs() {
  const [visitorLogs, setVisitorLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = ref(db, 'Visitor Logs');
    const unsubscribe = onValue(query, (snapshot) => {
      const data = snapshot.val();

      if (snapshot.exists()) {
        const logsWithIds = Object.entries(data).map(
          ([id, log]: [string, any]) => ({
            id,
            ...log,
          }),
        );
        setVisitorLogs(logsWithIds);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      {loading ? (
        <LoadingCard />
      ) : (
        <Card>
          <CardHeader className='pb-2'>
            <NotepadText className='text-muted-foreground h-6 w-6' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{visitorLogs.length}</div>
            <p className='text-xs text-muted-foreground'>Total Visitor Logs</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}

function LatestEntry() {
  return (
    <div className='border shadow-sm rounded-lg p-4'>
      <h2 className='font-bold text-lg'>Latest Entry</h2>
      <div className='space-y-1 text-sm'>
        <p>
          <span className='font-semibold'>Category: </span>Visitor
        </p>
        <p>
          <span className='font-semibold'>Name: </span>Name
        </p>
        <p>
          <span className='font-semibold'>Plate Number: </span>ABC 123
        </p>
        <p>
          <span className='font-semibold'>Date & Time: </span>Feb 05, 2024 1:30
          PM
        </p>
      </div>
    </div>
  );
}

function LatestExit() {
  return (
    <div className='border shadow-sm rounded-lg p-4'>
      <h2 className='font-bold text-lg'>Latest Exit</h2>
      <div className='space-y-1 text-sm'>
        <p>
          <span className='font-semibold'>Category: </span>Visitor
        </p>
        <p>
          <span className='font-semibold'>Name: </span>Name
        </p>
        <p>
          <span className='font-semibold'>Plate Number: </span>ABC 123
        </p>
        <p>
          <span className='font-semibold'>Date & Time: </span>Feb 05, 2024 1:30
          PM
        </p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className='flex h-full w-full flex-col gap-6'>
      <div className='grid grid-cols-3 gap-4'>
        <TotalRegisteredVehicles />
        <TotalVehicleLogs />
        <TotalVisitorLogs />
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <LatestEntry />
        <LatestExit />
      </div>
    </div>
  );
}
