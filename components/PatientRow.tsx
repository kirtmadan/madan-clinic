import { TableCell, TableRow } from "@/components/ui/table";
import Image from "next/image";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { EllipsisIcon } from "lucide-react";

interface PatientRowProps {
  id: string | number;
  name: string;
  created_on: string | number;
  age: number;
  phone: string;
  status: string;
  email: string;
}

export default function PatientRow({
  name,
  created_on,
  age,
  phone,
  status,
  email,
}: PatientRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium px-6 py-4 flex items-center gap-3">
        <Image
          src={`/images/patient.jpg`}
          className="rounded-lg"
          alt={name}
          width={40}
          height={40}
        />

        <span>{name}</span>
      </TableCell>
      <TableCell className="px-6 py-4">
        {dayjs(created_on).format("MMM DD, YYYY")}
      </TableCell>
      <TableCell className="px-6 py-4">{age}</TableCell>
      <TableCell className="px-6 py-4">{phone}</TableCell>
      <TableCell className="px-6 py-4">{status}</TableCell>
      <TableCell className="px-6 py-4">{email}</TableCell>
      <TableCell className="px-6 py-4">
        <Button variant="outline" size="sm">
          <EllipsisIcon />
        </Button>
      </TableCell>
    </TableRow>
  );
}
