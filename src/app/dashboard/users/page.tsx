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
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import CreateUserForm from './_components/create-user-form';
import { onValue, ref } from 'firebase/database';
import { db } from '@/firebase';
import { format } from 'date-fns';

interface UsersType {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'GUARD';
  createdAt: number;
}

export default function UserPage() {
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [users, setUsers] = useState<UsersType[]>([]);

  useEffect(() => {
    const query = ref(db, 'Users');
    const unsubscribe = onValue(query, (snapshot) => {
      const data = snapshot.val() as UsersType;

      if (snapshot.exists()) {
        const usersWithId = Object.entries(data).map(([id, users]) => ({
          id,
          ...users,
        }));
        setUsers(usersWithId);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <CreateUserForm open={openCreate} onClose={() => setOpenCreate(false)} />
      <div className='space-y-2'>
        <div className='flex justify-end'>
          <Button onClick={() => setOpenCreate(true)}>Create New User</Button>
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
                <TableHead>Email Address</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Date Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className='font-medium'>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{format(user.createdAt, 'P')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}
