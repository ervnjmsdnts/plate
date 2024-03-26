import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className='space-x-1'>
      <Button asChild>
        <Link href='/dashboard'>Go to Dashboard</Link>
      </Button>
      <Button asChild>
        <Link href='/qr'>Go To QR</Link>
      </Button>
      <Button asChild>
        <Link href='log-form'>Go To Log System</Link>
      </Button>
    </div>
  );
}
