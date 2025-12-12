"use client";

// import Link from "next/link";
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
  getPaginationRowModel,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CalendarIcon } from "lucide-react";

import dayjs from "dayjs";
import { useGetAllAppointments } from "@/lib/tanstack-query/appointments/Queries";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AppointmentDrawer from "@/components/appointments/AppointmentDrawer";
// import AppointmentStatusRenderer from "@/components/cellRenderers/AppointmentStatusRenderer";

export type Appointment = {
  id: string | number;
  name: string;
  patient: {
    id: string;
    name: string;
    phone: string | number;
  };
  created_on: string | number;
  age: number;
  phone: string;
  status: string;
  email: string;
};

export default function AppointmentsTable() {
  // const filters = useMemo(() => {
  //   if (!status) return undefined;
  //
  //   if (status === "completed") {
  //     return [(q: any) => q.eq("status", "completed")];
  //   }
  //
  //   return [(q: any) => q.neq("status", "completed")];
  // }, [status]);

  const { data } = useGetAllAppointments({
    select: `
    id,
    appointment_number,
    date,
    status,
    notes,
    created_at,
    call_status,
    patient:patient_id ( id, name, phone, status )
  `,
    // filters,
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

    // {
    //   accessorKey: "status",
    //   header: "Status",
    //   cell: ({ row }) => {
    //     return <AppointmentStatusRenderer status={row.getValue("status")} />;
    //   },
    // },

    {
      id: "patient.name",
      accessorFn: (row) => row?.patient?.name,
      header: "Patient Name",
      cell: ({ row }) => {
        const patientName: string = row.getValue("patient.name");

        return (
          <div className="font-medium w-full flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="border-[0.5px] uppercase">
                {patientName?.split(" ")?.[0]?.[0]}
                {patientName?.split(" ")?.[1]?.[0] ||
                  patientName?.split(" ")?.[0]?.[1]}
              </AvatarFallback>
            </Avatar>

            <span className="uppercase">{patientName}</span>
          </div>
        );
      },
    },
    {
      id: "patient.phone",
      accessorFn: (row) => row?.patient?.phone,
      header: "Phone number",
      cell: ({ row }) => <>{row.getValue("patient.phone")}</>,
    },
    {
      accessorKey: "date",
      header: "Appointment Date",
      cell: ({ row }) => (
        <>{dayjs(row.getValue("date")).format("DD MMM YYYY")}</>
      ),
    },
  ];

  const table = useReactTable({
    data: Array.isArray(data) ? data : [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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

  return (
    <Card className="gap-0">
      <CardHeader className="flex items-center justify-between border-b">
        <CardTitle className="flex items-center gap-4">
          <Button
            variant="link"
            size="icon"
            className="text-primary border round-lg cur"
          >
            <CalendarIcon />
          </Button>

          <span className="text-lg font-medium">Appointments</span>
        </CardTitle>

        <div className="flex items-center gap-6">
          {/*<InputWithIcon*/}
          {/*  type="text"*/}
          {/*  StartIcon={*/}
          {/*    <UserSearchIcon*/}
          {/*      className="text-muted-foreground pointer-events-none absolute left-2 top-1/2 -translate-y-1/2"*/}
          {/*      size={18}*/}
          {/*    />*/}
          {/*  }*/}
          {/*  placeholder="Search appo"*/}
          {/*  className="w-[400px] h-10"*/}
          {/*  value={globalFilter}*/}
          {/*  onChange={(event) => setGlobalFilter(event.target.value)}*/}
          {/*/>*/}

          {/*<Button*/}
          {/*  variant="outline"*/}
          {/*  className="h-10"*/}
          {/*  onClick={() => {*/}
          {/*    if (data && Array.isArray(data))*/}
          {/*      exportToCSV(data, "appointments-data.csv");*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <ArrowDownToLineIcon />*/}
          {/*  Export*/}
          {/*</Button>*/}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <DataTable table={table} />
      </CardContent>

      {/*<CardFooter>*/}
      {/*  <DeleteDialog*/}
      {/*    open={Boolean(openDelete)}*/}
      {/*    isLoading={isDeletingPatient}*/}
      {/*    title={`Delete the patient "${openDelete?.name}"?`}*/}
      {/*    description={`This action cannot be undone.`}*/}
      {/*    onConfirm={async () => {*/}
      {/*      await deletePatient({*/}
      {/*        documentId: openDelete?.id,*/}
      {/*        onSuccess: () => {*/}
      {/*          setOpenDelete(null);*/}
      {/*        },*/}
      {/*      });*/}
      {/*    }}*/}
      {/*    onCancel={() => {*/}
      {/*      setOpenDelete(null);*/}
      {/*    }}*/}
      {/*  />*/}
      {/*</CardFooter>*/}
    </Card>
  );
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
            table.getRowModel().rows.map((row) => (
              <AppointmentDrawer
                key={row?.original?.id}
                trigger={
                  <TableRow>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-6 py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                }
                appointmentData={row?.original}
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

      <div className="flex items-center justify-end space-x-2 py-4 px-6">
        {/*<div className="text-muted-foreground flex-1 text-sm">*/}
        {/*  {table.getFilteredSelectedRowModel().rows.length} of{" "}*/}
        {/*  {table.getFilteredRowModel().rows.length} appointment(s) selected.*/}
        {/*</div>*/}

        <div className="space-x-2 px-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
