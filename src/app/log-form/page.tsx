import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import HomeOwnerForm from './_components/home-owner-form';
import VisitorForm from './_components/visitor-form';

export default function LogFormPage() {
  return (
    <div className='h-screen w-screen flex items-center justify-center bg-primary'>
      <div className='bg-white flex rounded-md p-4 space-x-4'>
        {/* Image */}
        <div className='bg-primary flex flex-col gap-4 items-center justify-center text-center rounded-md text-white p-4'>
          <div className='relative w-full h-32'>
            <Image src='/log-image.png' fill alt='Log' />
          </div>
          <h2 className='font-bold text-2xl'>Welcome!</h2>
          <div className='text-sm'>
            <p>This is Danber Ville&apos;s</p>
            <p>Contactless Log System</p>
          </div>
        </div>
        {/* Form */}
        <div className='flex flex-col justify-center gap-4'>
          <div>
            <h1 className='text-lg font-bold'>Log Form</h1>
            <p className='text-sm'>Please fill up the form below.</p>
          </div>
          <Tabs defaultValue='home-owner' className='w-full'>
            <TabsList>
              <TabsTrigger value='home-owner'>Home Owner</TabsTrigger>
              <TabsTrigger value='visitor'>Visitor</TabsTrigger>
            </TabsList>
            <TabsContent value='home-owner'>
              <HomeOwnerForm />
            </TabsContent>
            <TabsContent value='visitor'>
              <VisitorForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
