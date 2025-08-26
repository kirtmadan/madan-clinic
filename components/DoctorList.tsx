"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
  type Table as TableType,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputWithIcon } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  ArrowUpDown,
  MoreHorizontal,
  TrashIcon,
  ArrowDownToLineIcon,
  Users,
  UserSearchIcon,
} from "lucide-react";

import DataTableRow from "@/components/DataTableRow";

import dayjs from "dayjs";
import { exportToCSV } from "@/lib/utils";
import { useGetAllDoctors } from "@/lib/tanstack-query/doctors/Queries";
import DeleteDialog from "@/components/shared/DeleteDialog";
import { useDeleteDoctor } from "@/lib/tanstack-query/doctors/Mutationts";

export default function DoctorList() {
  const { data } = useGetAllDoctors({});
  const { mutateAsync: deleteDoctor, isPending: isDeletingDoctor } =
    useDeleteDoctor();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [openDelete, setOpenDelete] = useState<Doctor | null>(null);

  const columns: ColumnDef<Doctor>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Doctor Name",
      cell: ({ row }) => (
        <div className="font-medium w-full flex items-center gap-3">
          <Image
            src={`/images/patient.jpg`}
            className="rounded-lg"
            alt={row.id}
            width={32}
            height={32}
          />

          <span>{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      accessorKey: "created_on",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0!"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created On
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <>{dayjs(row.getValue("created_on")).format("DD MMM YYYY")}</>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => {
        return <>{row.getValue("phone")}</>;
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return <>{row.getValue("email")}</>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: any }) => {
        const doctor = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/*<Link href={`/doctors/${doctor.id}`}>*/}
              {/*  <DropdownMenuItem className="cursor-pointer">*/}
              {/*    View doctor*/}
              {/*  </DropdownMenuItem>*/}
              {/*</Link>*/}
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer"
                onClick={() => setOpenDelete(doctor)}
              >
                <TrashIcon size={18} />
                <span>Delete doctor</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
            <Users />
          </Button>

          <span className="text-lg font-medium">Doctor List</span>
        </CardTitle>

        <div className="flex items-center gap-6">
          <InputWithIcon
            type="text"
            StartIcon={
              <UserSearchIcon
                className="text-muted-foreground pointer-events-none absolute left-2 top-1/2 -translate-y-1/2"
                size={18}
              />
            }
            placeholder="Search doctors"
            className="w-[400px] h-10"
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
          />

          <Button
            variant="outline"
            className="h-10"
            onClick={() => {
              // @ts-expect-error - data will always be an array
              exportToCSV(data, "doctor-data.csv");
            }}
          >
            <ArrowDownToLineIcon />
            Export
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <DataTable table={table} />
      </CardContent>

      <CardFooter>
        <DeleteDialog
          open={Boolean(openDelete)}
          isLoading={isDeletingDoctor}
          title={`Delete doctor "${openDelete?.name}"?`}
          description={`This action cannot be undone.`}
          onConfirm={async () => {
            await deleteDoctor({
              userId: openDelete?.user_id,
              onSuccess: () => {
                setOpenDelete(null);
              },
            });
          }}
        />
      </CardFooter>
    </Card>
  );
}

export type Doctor = {
  id: string | number;
  name: string;
  created_on: string | number;
  age: number;
  phone: string;
  status: string;
  email: string;
  user_id: string;
};

function DataTable({ table }: { table: TableType<Doctor> }) {
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

      <div className="flex items-center justify-end space-x-2 py-4 px-6">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} doctor(s) selected.
        </div>

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
