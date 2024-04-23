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
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { db } from '@/firebase';
import { child, get, ref, set, update } from 'firebase/database';
import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useState } from 'react';

interface ResultsType {
  name: string;
  address: string;
  contactNum: string;
  homeOwnerToVisit: string;
  purposeOfVisit: string;
  expirationTime: number;
  qrId: string;
}

export default function QRScanPage() {
  const [scan, setScan] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [results, setResults] = useState({} as ResultsType);
  const [timeType, setTimeType] = useState('');

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

  // ? Possible to change logic, to where it save and update on both timeIn and timeOut based on which data is empty
  const writeVisitorLog = async () => {
    try {
      if (timeType === 'TIMEOUT') {
        const logSnapshot = await get(
          child(ref(db), `Visitor Logs/${results.qrId}`),
        );
        if (logSnapshot.exists()) {
          const existingsLogData = logSnapshot.val();
          await update(ref(db), {
            [`Visitor Logs/${results.qrId}`]: {
              ...existingsLogData,
              timeOut: new Date().getTime(),
            },
          });
        } else {
          toast({ title: 'Log data does not exist', variant: 'destructive' });
          return;
        }
      } else {
        await set(ref(db, `Visitor Logs/${results.qrId}`), {
          name: results.name,
          address: results.address,
          contactNumber: results.contactNum,
          homeOwnerToVisit: results.homeOwnerToVisit,
          purposeOfVisit: results.purposeOfVisit,
          timeIn: new Date().getTime(),
        });
      }
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
          <div className='flex flex-col gap-2'>
            <p>
              QR code successfully scanned and processed. Information extracted:
            </p>
            <ul className='list-disc ml-5'>
              <li>Name: {results.name}</li>
              <li>Address: {results.address}</li>
              <li>Contact Number: {results.contactNum}</li>
            </ul>
            <RadioGroup
              onValueChange={(value) => setTimeType(value)}
              value={timeType}
              className='flex'>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='TIMEIN' id='TIMEIN' />
                <Label htmlFor='TIMEIN'>Time In</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='TIMEOUT' id='TIMEOUT' />
                <Label htmlFor='TIMEOUT'>Time Out</Label>
              </div>
            </RadioGroup>
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
          <div className='relative w-80 h-80'>
            <div className='absolute z-20 border-t-4 border-l-4 border-primary w-14 h-14 -top-3 -left-3'></div>
            <div className='absolute z-20 border-t-4 border-r-4 border-primary w-14 h-14 -top-3 -right-3'></div>
            <div className='absolute z-20 border-b-4 border-l-4 border-primary w-14 h-14 -bottom-3 -left-3'></div>
            <div className='absolute z-20 border-b-4 border-r-4 border-primary w-14 h-14 -bottom-3 -right-3'></div>
            {scan ? (
              <div className='w-80 h-80' id='reader' />
            ) : (
              <div className='w-80 h-80 bg-secondary' />
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
