'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { db } from '@/firebase';
import { onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface VisitorLogsType {
  address: string;
  contactNumber: string;
  name: string;
  timestamp: number;
  type: 'IN' | 'OUT';
  id: string;
}

export default function VisitorsLogsPage() {
  const [visitorLogs, setVisitorLogs] = useState<VisitorLogsType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = ref(db, 'Visitor Logs');
    const unsubscribe = onValue(query, (snapshot) => {
      const data = snapshot.val() as VisitorLogsType;

      if (snapshot.exists()) {
        console.log(data);
        const logsWithIds = Object.entries(data).map(([id, log]) => ({
          id,
          ...log,
        }));
        setVisitorLogs(logsWithIds);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className='w-full h-full'>
      {loading ? (
        <div className='flex justify-center items-center h-full'>
          <Loader2 className='animate-spin h-8 w-8' />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Time In/Out</TableHead>
              <TableHead>Name of Visitors</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Contact Number</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visitorLogs?.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.type}</TableCell>
                <TableCell>{format(log.timestamp, 'Pp')}</TableCell>
                <TableCell className='font-medium'>{log.name}</TableCell>
                <TableCell>{log.address}</TableCell>
                <TableCell>{log.contactNumber}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
