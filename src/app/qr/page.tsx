'use client';

import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useState } from 'react';

export default function QRPage() {
  const [scan, setScan] = useState(false);
  const [results, setResults] = useState('');

  useEffect(() => {
    if (scan) {
      const qrcode = new Html5Qrcode('reader');
      const success = (result: string) => {
        setResults(result);
      };

      const error = (error: any) => {
        console.warn(error);
      };

      qrcode.start(
        { facingMode: { exact: 'user' } },
        { fps: 5, videoConstraints: { width: 100, height: 100 } },
        success,
        error,
      );
    }
  }, [scan]);

  return (
    <main className='flex items-center justify-center'>
      <div className='border flex'>
        <div>
          {scan && <div className='w-64 h-64' id='reader'></div>}
          <button onClick={() => setScan(true)}>Scan</button>
        </div>
        <div>
          <p>results:</p>
          {results && <p>{results}</p>}
        </div>
      </div>
    </main>
  );
}
