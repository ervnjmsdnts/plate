'use client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  Archive,
  BookText,
  CarFront,
  LayoutDashboard,
  LogOut,
  QrCode,
  User,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import { UserType } from '@/app/dashboard/types';

export default function Sidebar({ name, email, role }: UserType) {
  const pathname = usePathname();

  const router = useRouter();

  const handleLogout = async () => {
    localStorage.removeItem('role');
    await signOut(auth);

    await fetch('/api/logout');

    router.push('/');
  };

  return (
    <nav className='h-full py-4 pr-2 pl-4 min-w-64 flex flex-col'>
      <div className='flex-grow'>
        <div className='flex justify-center'>
          <div className='relative w-24 h-24'>
            <Image src='/logo-vmos.png' alt='Logo' layout='fill' />
          </div>
        </div>
        <div className='flex flex-col gap-2 pt-4'>
          <Button
            className='justify-start'
            asChild
            variant={pathname === '/dashboard' ? 'outline' : 'ghost'}>
            <Link href='/dashboard'>
              <LayoutDashboard className='mr-2 h-4 w-4' /> Dashboard
            </Link>
          </Button>
          {role === 'ADMIN' && (
            <Button
              className='justify-start'
              asChild
              variant={pathname === '/dashboard/users' ? 'outline' : 'ghost'}>
              <Link href='/dashboard/users'>
                <Users className='mr-2 h-4 w-4' /> Users
              </Link>
            </Button>
          )}
          <p className='text-xs pl-1 py-3 font-medium text-gray-400 uppercase'>
            Vehicles
          </p>
          <Button
            className='justify-start'
            asChild
            variant={
              pathname === '/dashboard/vehicles/logs' ? 'outline' : 'ghost'
            }>
            <Link href='/dashboard/vehicles/logs'>
              <BookText className='mr-2 h-4 w-4' /> Logs
            </Link>
          </Button>
          {role === 'ADMIN' && (
            <Button
              className='justify-start'
              asChild
              variant={
                pathname === '/dashboard/vehicles/registrations'
                  ? 'outline'
                  : 'ghost'
              }>
              <Link href='/dashboard/vehicles/registrations'>
                <CarFront className='mr-2 h-4 w-4' /> Registrations
              </Link>
            </Button>
          )}
          {role === 'ADMIN' && (
            <Button
              className='justify-start'
              asChild
              variant={
                pathname === '/dashboard/vehicles/archived'
                  ? 'outline'
                  : 'ghost'
              }>
              <Link href='/dashboard/vehicles/archived'>
                <Archive className='mr-2 h-4 w-4' /> Archived
              </Link>
            </Button>
          )}
          <p className='text-xs pl-1 py-3 font-medium text-gray-400 uppercase'>
            Visitors
          </p>
          <Button
            className='justify-start w-full'
            asChild
            variant={
              pathname === '/dashboard/visitors/logs' ? 'outline' : 'ghost'
            }>
            <Link href='/dashboard/visitors/logs'>
              <BookText className='mr-2 h-4 w-4' /> Logs
            </Link>
          </Button>
          {role === 'GUARD' && (
            <Button
              className='justify-start w-full'
              asChild
              variant={
                pathname === '/dashboard/visitors/qr-scan' ? 'outline' : 'ghost'
              }>
              <Link href='/dashboard/visitors/qr-scan'>
                <QrCode className='mr-2 h-4 w-4' /> QR Scan
              </Link>
            </Button>
          )}
        </div>
      </div>
      {/* Avatar */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className='bg-white p-4 hover:bg-gray-50 cursor-pointer border rounded-md'>
            <div className='flex gap-2'>
              <div className='flex justify-center items-center'>
                <User className='w-5 h-5' />
              </div>
              <div>
                <p className='text-xs font-medium'>{name}</p>
                <p className='text-xs truncate'>{email}</p>
              </div>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56'>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className='mr-2 h-4 w-4' />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
