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

interface VisitorLogsType {
  address: string;
  contactNumber: string;
  name: string;
  homeOwnerToVisit: string;
  purposeOfVisit: string;
  timeIn: number;
  timeOut: number;
  id: string;
}

export default function VisitorsLogsPage() {
  const [visitorLogs, setVisitorLogs] = useState<VisitorLogsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15); // Adjust as needed
  const [searchTerm, setSearchTerm] = useState('');
  const [timeInDate, setTimeInDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [timeOutDate, setTimeOutDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    const query = ref(db, 'Visitor Logs');
    const unsubscribe = onValue(query, (snapshot) => {
      const data = snapshot.val() as VisitorLogsType;

      if (snapshot.exists()) {
        const logsWithIds = Object.entries(data).map(([id, log]) => ({
          id,
          ...log,
        }));
        const sortedLogs = logsWithIds
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name));
        setVisitorLogs(sortedLogs);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Logic to paginate data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredLogs = visitorLogs
    .filter((log) => log.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((log) => {
      if (!timeInDate?.from || !timeInDate.to) return true;
      return (
        log.timeIn >= timeInDate.from.getTime() &&
        log.timeIn <= timeInDate.to.getTime()
      );
    })
    .filter((log) => {
      if (!timeOutDate?.from || !timeOutDate.to) return true;
      return (
        log.timeOut >= timeOutDate.from.getTime() &&
        log.timeOut <= timeOutDate.to.getTime()
      );
    });
  const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const csvData = useMemo(
    () =>
      currentItems?.map((item) => ({
        'Time In': format(item.timeIn ?? new Date(), 'Ppp'),
        'Time Out': format(item.timeOut ?? new Date(), 'Ppp'),
        'Name of Visitor': item.name,
        Address: item.address,
        'Contact Number': item.contactNumber,
        'Homeowner to Visit': item.homeOwnerToVisit,
        'Purpose of Visit': item.purposeOfVisit,
      })),
    [currentItems],
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
                className='max-w-[340px]'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            <Button asChild>
              <CSVLink data={csvData} filename='visitor-logs.csv'>
                Export CSV
              </CSVLink>
            </Button>
          </div>
          <div className='flex-grow'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time In</TableHead>
                  <TableHead>Time Out</TableHead>
                  <TableHead>Name of Visitor</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Contact Number</TableHead>
                  <TableHead>Homeowner to Visit</TableHead>
                  <TableHead>Purpose of Visit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{format(log.timeIn, 'Ppp')}</TableCell>
                    <TableCell>
                      {log?.timeOut ? format(log?.timeOut, 'Ppp') : ''}
                    </TableCell>
                    <TableCell className='font-medium'>{log.name}</TableCell>
                    <TableCell>{log.address}</TableCell>
                    <TableCell>{log.contactNumber}</TableCell>
                    <TableCell>{log.homeOwnerToVisit}</TableCell>
                    <TableCell>{log.purposeOfVisit}</TableCell>
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
