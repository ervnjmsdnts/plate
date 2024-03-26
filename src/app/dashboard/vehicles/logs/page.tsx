import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function VehiclesLogsPage() {
  return (
    <div className='w-full'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time In</TableHead>
            <TableHead>Time Out</TableHead>
            <TableHead>Name of Homeowners</TableHead>
            <TableHead>Plate Number</TableHead>
            <TableHead>Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>March 04, 2024 - 11:59 PM</TableCell>
            <TableCell>March 04, 2024 - 01:32 PM</TableCell>
            <TableCell className='font-medium'>
              John Kenneth De Chavez
            </TableCell>
            <TableCell>ABC 123</TableCell>
            <TableCell>Homeowner</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
