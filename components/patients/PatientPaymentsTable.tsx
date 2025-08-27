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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AppointmentStatusRenderer from "@/components/cellRenderers/AppointmentStatusRenderer";
import { useGetAllPayments } from "@/lib/tanstack-query/payments/Queries";

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

export default function PatientPaymentsTable({ id }: { id: string }) {
  const { data } = useGetAllPayments({
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
      accessorKey: "id",
      header: "Payment ID",
      cell: ({ row }) => <># {row.getValue("id")}</>,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        return (
          <AppointmentStatusRenderer
            status={
              (row.getValue("amount") as number) < 0 ? "cancelled" : "completed"
            }
          >
            ₹ {row.getValue("amount")}
          </AppointmentStatusRenderer>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => (
        <>{dayjs(row.getValue("created_at")).format("DD MMM YYYY")}</>
      ),
    },
    {
      accessorKey: "notes",
      header: "Payment Notes",
      cell: ({ row }) => {
        return <> {row.getValue("notes")} </>;
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
