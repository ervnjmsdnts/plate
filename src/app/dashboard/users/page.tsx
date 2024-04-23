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
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit2,
  Loader2,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import CreateUserForm from './_components/create-user-form';
import { onValue, ref } from 'firebase/database';
import { db } from '@/firebase';
import { format } from 'date-fns';
import EditUserForm from './_components/edit-user-form';
import DeleteUser from './_components/delete-user';
import { Input } from '@/components/ui/input';

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

  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedEditUser, setSelectedEditUser] = useState<UsersType>(
    {} as UsersType,
  );
  const [selectedDeleteUser, setSelectedDeleteUser] = useState<UsersType>(
    {} as UsersType,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8); // Adjust as needed
  const [searchTerm, setSearchTerm] = useState('');

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

  // Logic to paginate data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const selectEditUser = (user: UsersType) => {
    setSelectedEditUser(user);
    setOpenEdit(true);
  };

  const selectDeleteUser = (user: UsersType) => {
    setSelectedDeleteUser(user);
    setOpenDelete(true);
  };

  return (
    <>
      <CreateUserForm open={openCreate} onClose={() => setOpenCreate(false)} />
      <EditUserForm
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        user={selectedEditUser}
      />
      <DeleteUser
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        user={selectedDeleteUser}
      />
      <div className='w-full h-full'>
        {loading ? (
          <div className='flex justify-center items-center h-full'>
            <Loader2 className='animate-spin h-8 w-8' />
          </div>
        ) : (
          <div className='w-full h-full flex flex-col gap-2'>
            <div className='flex justify-between'>
              <Input
                placeholder='Search by name'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='max-w-[340px]'
              />
              <Button onClick={() => setOpenCreate(true)}>
                Create New User
              </Button>
            </div>
            <div className='flex-grow'>
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
                  {currentItems.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className='font-medium'>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{format(user.createdAt, 'P')}</TableCell>

                      <TableCell className='space-x-2'>
                        <Button
                          size='icon'
                          variant='outline'
                          onClick={() => selectEditUser(user)}>
                          <Edit2 className='w-4 h-4' />
                        </Button>
                        <Button
                          onClick={() => selectDeleteUser(user)}
                          size='icon'
                          variant='destructive'>
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

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
