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
import { Edit2, Loader2, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import CreateVehicleForm from './_components/create-vehicle-form';
import { format } from 'date-fns';
import EditVehicleForm from './_components/edit-vehicle-form';
import DeleteVehicle from './_components/delete-vehicle';

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

export default function VehicleRegistrationsPage() {
  const [registeredVehicles, setRegisteredVehicles] = useState<
    RegisteredVehiclesType[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedEditVehicle, setSelectedEditVehicle] = useState(
    {} as RegisteredVehiclesType,
  );
  const [selectedDeleteVehicle, setSelectedDeleteVehicle] = useState(
    {} as RegisteredVehiclesType,
  );

  useEffect(() => {
    const query = ref(db, 'Registered Vehicles');
    const unsubscribe = onValue(query, (snapshot) => {
      const data = snapshot.val() as RegisteredVehiclesType;

      if (snapshot.exists()) {
        const vehiclesWithIds = Object.entries(data).map(([id, vehicles]) => ({
          id,
          ...vehicles,
        }));
        setRegisteredVehicles(vehiclesWithIds);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const activeVehicles = useMemo(
    () => registeredVehicles?.filter((v) => v.isActive),
    [registeredVehicles],
  );

  const selectEditVehicle = (vehicle: RegisteredVehiclesType) => {
    setSelectedEditVehicle(vehicle);
    setOpenEdit(true);
  };

  const selectDeleteVehicle = (vehicle: RegisteredVehiclesType) => {
    setSelectedDeleteVehicle(vehicle);
    setOpenDelete(true);
  };

  return (
    <>
      <CreateVehicleForm
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />
      <EditVehicleForm
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        vehicle={selectedEditVehicle}
      />
      <DeleteVehicle
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        vehicle={selectedDeleteVehicle}
      />
      <div className='space-y-2'>
        <div className='flex justify-end'>
          <Button onClick={() => setOpenCreate(true)}>Register New Car</Button>
        </div>
        {loading ? (
          <div className='flex justify-center items-center h-full'>
            <Loader2 className='animate-spin h-8 w-8' />
          </div>
        ) : (
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
              {activeVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className='font-medium'>{vehicle.name}</TableCell>
                  <TableCell>{vehicle.plateNumber}</TableCell>
                  <TableCell>{vehicle.category}</TableCell>
                  <TableCell>{vehicle.paymentName}</TableCell>
                  <TableCell>{vehicle.paymentStatus}</TableCell>
                  <TableCell>{format(vehicle.paymentDueDate, 'P')}</TableCell>
                  <TableCell>{format(vehicle.dateRegistered, 'P')}</TableCell>
                  <TableCell className='space-x-2'>
                    <Button
                      onClick={() => selectEditVehicle(vehicle)}
                      size='icon'
                      variant='outline'>
                      <Edit2 className='w-4 h-4' />
                    </Button>
                    <Button
                      onClick={() => selectDeleteVehicle(vehicle)}
                      size='icon'
                      variant='destructive'>
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}
