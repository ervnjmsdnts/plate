'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { db } from '@/firebase';
import { ref, set } from 'firebase/database';
import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface ResultsType {
  name: string;
  address: string;
  contactNum: string;
  expirationTime: number;
}

export default function QRScanPage() {
  const [scan, setScan] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [results, setResults] = useState({} as ResultsType);

  const { toast } = useToast();

  useEffect(() => {
    if (scan) {
      const qrcode = new Html5Qrcode('reader');
      const success = (data: string) => {
        const results = JSON.parse(data) as ResultsType;
        const currentTime = new Date().getTime();
        if (currentTime > results.expirationTime) {
          setOpenError(true);
        } else {
          setResults(results);
          setOpenSuccess(true);
        }
        qrcode.stop();
        setScan(false);
      };

      const error = (error: any) => {
        console.log(error);
      };

      qrcode.start(
        { facingMode: { exact: 'user' } },
        { fps: 5, videoConstraints: { width: 100, height: 100 } },
        success,
        error,
      );
    }
  }, [scan]);

  const writeVisitorLog = async () => {
    try {
      await set(ref(db, 'Visitor Logs/' + uuidv4()), {
        name: results.name,
        address: results.address,
        contactNumber: results.contactNum,
        type: 'IN',
        timestamp: new Date().getTime(),
      });
      setOpenSuccess(false);
      toast({ title: 'Visitor log has been successfully recorded' });
    } catch (_) {
      toast({ title: 'Error recording visitor log', variant: 'destructive' });
    }
  };

  return (
    <>
      <Dialog open={openSuccess} onOpenChange={() => setOpenSuccess(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success: QR Code Scanned</DialogTitle>
          </DialogHeader>
          <div>
            <p>
              QR code successfully scanned and processed. Information extracted:
            </p>
            <ul className='list-disc ml-5 pt-2'>
              <li>Name: {results.name}</li>
              <li>Address: {results.address}</li>
              <li>Contact Number: {results.contactNum}</li>
            </ul>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type='button' variant='outline'>
                Deny
              </Button>
            </DialogClose>
            <Button onClick={writeVisitorLog}>Accept</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={openError} onOpenChange={() => setOpenError(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error: QR Code Expired</DialogTitle>
          </DialogHeader>
          <div>
            <p>
              Uh-oh! The QR code you scanned has expired. Please obtain a fresh
              QR code and try again.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type='button' variant='outline'>
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <main className='flex items-center h-full justify-center'>
        <div className='space-y-6'>
          <div className='relative w-64 h-64'>
            <div className='absolute z-20 border-t-4 border-l-4 border-primary w-14 h-14 -top-3 -left-3'></div>
            <div className='absolute z-20 border-t-4 border-r-4 border-primary w-14 h-14 -top-3 -right-3'></div>
            <div className='absolute z-20 border-b-4 border-l-4 border-primary w-14 h-14 -bottom-3 -left-3'></div>
            <div className='absolute z-20 border-b-4 border-r-4 border-primary w-14 h-14 -bottom-3 -right-3'></div>
            {scan ? (
              <div className='w-64 h-64' id='reader' />
            ) : (
              <div className='w-64 h-64 bg-secondary' />
            )}
          </div>
          <Button size='lg' className='w-full' onClick={() => setScan(true)}>
            Scan
          </Button>
        </div>
      </main>
    </>
  );
}
