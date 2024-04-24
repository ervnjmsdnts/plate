'use client';

import { Button } from '@/components/ui/button';

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
import {
  ArchiveX,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import UnarchiveVehicle from './_components/unarchive';

interface RegisteredVehiclesType {
  id: string;
  name: string;
  plateNumber: string;
  category: 'HOMEOWNER' | 'VISITOR';
  paymentName: string;
  paymentStatus: 'PAID' | 'UNPAID';
  paymentDueDate: number;
  dateRegistered: number;
  isActive: boolean;
}

export default function ArchivedRegistrationPage() {
  const [registeredVehicles, setRegisteredVehicles] = useState<
    RegisteredVehiclesType[]
  >([]);
  const [loading, setLoading] = useState(true);

  const [openUnarchive, setOpenUnarchive] = useState(false);
  const [selectedUnarchived, setSelectedUnArchive] = useState(
    {} as RegisteredVehiclesType,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8); // Adjust as needed
  const [searchTermName, setSearchTermName] = useState('');
  const [searchTermPlateNumber, setSearchTermPlateNumber] = useState('');
  const [searchTermPaymentName, setSearchTermPaymentName] = useState('');
  useEffect(() => {
    const query = ref(db, 'Registered Vehicles');
    const unsubscribe = onValue(query, (snapshot) => {
      const data = snapshot.val() as RegisteredVehiclesType;

      if (snapshot.exists()) {
        const vehiclesWithIds = Object.entries(data).map(([id, vehicles]) => ({
          id,
          ...vehicles,
        }));
        const sortedLogs = vehiclesWithIds
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name));
        setRegisteredVehicles(sortedLogs);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const activeVehicles = useMemo(
    () => registeredVehicles?.filter((v) => !v.isActive),
    [registeredVehicles],
  );

  // Logic to paginate data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredLogs = activeVehicles.filter(
    (log) =>
      log.name.toLowerCase().includes(searchTermName.toLowerCase()) &&
      log.plateNumber
        .toLowerCase()
        .includes(searchTermPlateNumber.toLowerCase()) &&
      log.paymentName
        .toLowerCase()
        .includes(searchTermPaymentName.toLowerCase()),
  );
  const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const selectUnarchive = (vehicle: RegisteredVehiclesType) => {
    setSelectedUnArchive(vehicle);
    setOpenUnarchive(true);
  };

  return (
    <>
      <UnarchiveVehicle
        open={openUnarchive}
        onClose={() => setOpenUnarchive(false)}
        vehicle={selectedUnarchived}
      />
      <div className='w-full h-full'>
        {loading ? (
          <div className='flex justify-center items-center h-full'>
            <Loader2 className='animate-spin h-8 w-8' />
          </div>
        ) : (
          <div className='w-full h-full flex flex-col gap-2'>
            <div className='flex gap-2'>
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
              <Input
                placeholder='Search by payment name'
                value={searchTermPaymentName}
                onChange={(e) => setSearchTermPaymentName(e.target.value)}
                className='max-w-[340px]'
              />
            </div>
            <div className='flex-grow'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Plate Number</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Payment Name</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Payment Due Date</TableHead>
                    <TableHead>Date Registered</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className='font-medium'>
                        {vehicle.name}
                      </TableCell>
                      <TableCell>{vehicle.plateNumber}</TableCell>
                      <TableCell>{vehicle.category}</TableCell>
                      <TableCell>{vehicle.paymentName}</TableCell>
                      <TableCell>{vehicle.paymentStatus}</TableCell>
                      <TableCell>
                        {format(vehicle.paymentDueDate, 'P')}
                      </TableCell>
                      <TableCell>
                        {format(vehicle.dateRegistered, 'P')}
                      </TableCell>
                      <TableCell>
                        <Button
                          size='icon'
                          variant='outline'
                          onClick={() => selectUnarchive(vehicle)}>
                          <ArchiveX className='w-4 h-4' />
                        </Button>
                      </TableCell>
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
    </>
  );
}
