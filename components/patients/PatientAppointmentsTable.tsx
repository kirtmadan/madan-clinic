"use client";

import { useState } from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  // getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
  type Table as TableType,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import DataTableRow from "@/components/DataTableRow";

import dayjs from "dayjs";

import { useGetAllAppointments } from "@/lib/tanstack-query/appointments/Queries";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AppointmentDrawer from "@/components/appointments/AppointmentDrawer";
import AppointmentStatusRenderer from "@/components/cellRenderers/AppointmentStatusRenderer";

export type Appointment = {
  id: string | number;
  name: string;
  doctor: {
    id: string;
    name: string;
  };
  patient: {
    id: string;
    name: string;
  };
  created_on: string | number;
  age: number;
  phone: string;
  status: string;
  email: string;
};

export default function PatientAppointmentsTable({ id }: { id: string }) {
  const { data } = useGetAllAppointments({
    select: `
    id,
    appointment_number,
    date,
    status,
    notes,
    created_at,
    doctor:doctor_id ( id, name ),
    patient:patient_id ( id, name )
  `,
    filters: [(query: any) => query.eq("patient_id", id)],
    limit: 5,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<Appointment>[] = [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && "indeterminate")
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //       className="bg-transparent! data-[state=checked]:bg-primary!"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //       className="bg-transparent! data-[state=checked]:bg-primary!"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: "appointment_number",
      header: "Appointment Number",
      cell: ({ row }) => (
        <AppointmentDrawer
          key={row.id}
          appointmentData={row.original}
          trigger={<span># {row.getValue("appointment_number")}</span>}
        />
      ),
    },
    {
      accessorKey: "date",
      header: "Appointment Date",
      cell: ({ row }) => (
        <>{dayjs(row.getValue("date")).format("DD MMM YYYY")}</>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return <AppointmentStatusRenderer status={row.getValue("status")} />;
      },
    },
    // {
    //   id: "patient.name",
    //   accessorFn: (row) => row.patient.name,
    //   header: "Patient Name",
    //   cell: ({ row }) => {
    //     const patientName: string = row.getValue("patient.name");
    //
    //     return (
    //       <Link href={`/patients/${row.original.patient.id}`}>
    //         <div className="font-medium w-full flex items-center gap-3 hover:text-primary">
    //           <Avatar>
    //             <AvatarFallback className="border-[0.5px] uppercase">
    //               {patientName?.split(" ")?.[0]?.[0]}
    //               {patientName?.split(" ")?.[1]?.[0] ||
    //                 patientName?.split(" ")?.[0]?.[1]}
    //             </AvatarFallback>
    //           </Avatar>
    //
    //           <span>{patientName}</span>
    //         </div>
    //       </Link>
    //     );
    //   },
    // },
    {
      id: "doctor.name",
      accessorFn: (row) => row.doctor.name,
      header: "Doctor Name",
      cell: ({ row }) => {
        const doctorName: string = row.getValue("doctor.name");

        return (
          <div className="font-medium w-full flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="border-[0.5px] uppercase">
                {doctorName?.split(" ")?.[0]?.[0]}
                {doctorName?.split(" ")?.[1]?.[0] ||
                  doctorName?.split(" ")?.[0]?.[1]}
              </AvatarFallback>
            </Avatar>

            <span>Dr. {doctorName}</span>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: Array.isArray(data) ? data : [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  return <DataTable table={table} />;
}

function DataTable({ table }: { table: TableType<Appointment> }) {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="px-6 py-2 text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table
              .getRowModel()
              .rows.map((row) => (
                <DataTableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  row={row}
                />
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/*<div className="flex items-center justify-end space-x-2 py-4 px-6">*/}
      {/*  /!*<div className="text-muted-foreground flex-1 text-sm">*!/*/}
      {/*  /!*  {table.getFilteredSelectedRowModel().rows.length} of{" "}*!/*/}
      {/*  /!*  {table.getFilteredRowModel().rows.length} appointment(s) selected.*!/*/}
      {/*  /!*</div>*!/*/}

      {/*  <div className="space-x-2 px-6">*/}
      {/*    <Button*/}
      {/*      variant="outline"*/}
      {/*      size="sm"*/}
      {/*      onClick={() => table.previousPage()}*/}
      {/*      disabled={!table.getCanPreviousPage()}*/}
      {/*    >*/}
      {/*      Previous*/}
      {/*    </Button>*/}

      {/*    <Button*/}
      {/*      variant="outline"*/}
      {/*      size="sm"*/}
      {/*      onClick={() => table.nextPage()}*/}
      {/*      disabled={!table.getCanNextPage()}*/}
      {/*    >*/}
      {/*      Next*/}
      {/*    </Button>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
}
