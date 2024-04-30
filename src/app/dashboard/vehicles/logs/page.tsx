'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { format } from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DateRangePicker from '@/components/date-range-picker';
import { DateRange } from 'react-day-picker';
import { CSVLink } from 'react-csv';

interface VehicleLogsType {
  Category: string;
  Entry: number;
  Exit: number | null | undefined;
  'Plate Number': string;
  'Vehicle ID': string;
  id: string;
  name: string | null;
}

export default function VehicleLogsPage() {
  const [registeredLogs, setRegisteredLogs] = useState<any[]>([]);
  const [vehicleLogs, setVehicleLogs] = useState<VehicleLogsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8); // Adjust as needed
  const [searchTermName, setSearchTermName] = useState('');
  const [searchTermPlateNumber, setSearchTermPlateNumber] = useState('');
  const [timeInDate, setTimeInDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [timeOutDate, setTimeOutDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const { role } = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const query = ref(db, 'Vehicle Logs');
    const unsubscribe = onValue(query, (snapshot) => {
      const data = snapshot.val() as VehicleLogsType;

      if (snapshot.exists()) {
        const logsWithIds = Object.entries(data).map(([id, log]) => ({
          id,
          ...log,
        })) as VehicleLogsType[];

        // Sorting the logs by entry date
        const sorted = logsWithIds.sort((a, b) => {
          // Assuming log.Entry is a date string
          return new Date(b.Entry).getTime() - new Date(a.Entry).getTime();
        });

        setVehicleLogs(sorted);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const query = ref(db, 'Registered Vehicles');
    const unsubscribe = onValue(query, (snapshot) => {
      const data = snapshot.val() as VehicleLogsType;

      if (snapshot.exists()) {
        const logsWithIds = Object.entries(data).map(([id, log]) => ({
          id,
          ...log,
        }));
        setRegisteredLogs(logsWithIds);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const combinedLogs = useMemo(
    () =>
      vehicleLogs.map((item) => {
        const correspondingItem = registeredLogs.find(
          (element) => element.id === item['Vehicle ID'],
        );
        return { ...item, name: correspondingItem?.name };
      }),
    // .filter((item) => item.name),
    [vehicleLogs, registeredLogs],
  );

  // Logic to paginate data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredLogs = combinedLogs
    .filter((log) => {
      if (searchTermName && log.name) {
        return (
          log.name.toLowerCase().includes(searchTermName.toLowerCase()) &&
          log['Plate Number']
            .toLowerCase()
            .includes(searchTermPlateNumber.toLowerCase())
        );
      } else if (!searchTermName) {
        return log['Plate Number']
          .toLowerCase()
          .includes(searchTermPlateNumber.toLowerCase());
      } else {
        return false;
      }
    })
    .filter((log) => {
      if (!timeInDate?.from || !timeInDate.to) return true;
      return (
        log.Entry >= timeInDate.from.getTime() &&
        (log.Exit || Infinity) <= timeInDate.to.getTime()
      );
    })
    .filter((log) => {
      if (!timeOutDate?.from || !timeOutDate.to) return true;
      return (
        log.Entry >= timeOutDate.from.getTime() &&
        (log.Exit || Infinity) <= timeOutDate.to.getTime()
      );
    });
  const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const csvData = useMemo(
    () =>
      filteredLogs?.map((item) => ({
        'Time In': item.Entry ? format(item.Entry, 'Ppp') : '',
        'Time Out': item.Exit ? format(item.Exit, 'Ppp') : '',
        Name: item.name,
        Category: item.Category,
        'Plate Number': item['Plate Number'],
      })),
    [filteredLogs],
  );

  return (
    <div className='w-full h-full'>
      {loading ? (
        <div className='flex justify-center items-center h-full'>
          <Loader2 className='animate-spin h-8 w-8' />
        </div>
      ) : (
        <div className='flex flex-col w-full h-full gap-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Input
                placeholder='Search by name'
                value={searchTermName}
                onChange={(e) => setSearchTermName(e.target.value)}
                className='max-w-[340px]'
              />
              <Input
                placeholder='Search by plate number'
                value={searchTermPlateNumber}
                onChange={(e) => setSearchTermPlateNumber(e.target.value)}
                className='max-w-[340px]'
              />
              <DateRangePicker
                placeholder='Pick a time in date'
                date={timeInDate}
                setDate={setTimeInDate}
              />
              <DateRangePicker
                placeholder='Pick a time out date'
                date={timeOutDate}
                setDate={setTimeOutDate}
              />
            </div>
            {role === 'ADMIN' && (
              <Button asChild>
                <CSVLink data={csvData} filename='vehicle-logs.csv'>
                  Export CSV
                </CSVLink>
              </Button>
            )}
          </div>
          <div className='flex-grow'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time In</TableHead>
                  <TableHead>Time Out</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Plate Number</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {log.Entry ? format(log.Entry, 'Ppp') : ''}
                    </TableCell>
                    <TableCell>
                      {log?.Exit ? format(log?.Exit, 'Ppp') : ''}
                    </TableCell>
                    <TableCell className='font-medium'>{log.name}</TableCell>
                    <TableCell>{log.Category.toUpperCase()}</TableCell>
                    <TableCell>{log['Plate Number']}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Pagination */}
          <div className='flex justify-end items-center gap-8'>
            <span className='text-sm'>
              Page {currentPage} of {totalPages}
            </span>
            <div className='flex justify-end items-center gap-2'>
              <Button
                disabled={currentPage === 1}
                variant='outline'
                onClick={() => paginate(1)}
                size='icon'>
                <ChevronsLeft className='w-4 h-4' />
              </Button>
              <Button
                disabled={currentPage === 1}
                variant='outline'
                onClick={() => paginate(currentPage - 1)}
                size='icon'>
                <ChevronLeft className='w-4 h-4' />
              </Button>
              <Button
                disabled={currentPage === totalPages || totalPages === 0}
                variant='outline'
                onClick={() => paginate(currentPage + 1)}
                size='icon'>
                <ChevronRight className='w-4 h-4' />
              </Button>
              <Button
                disabled={currentPage === totalPages || totalPages === 0}
                variant='outline'
                onClick={() => paginate(totalPages)}
                size='icon'>
                <ChevronsRight className='w-4 h-4' />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
