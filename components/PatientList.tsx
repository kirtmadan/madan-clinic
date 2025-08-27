"use client";

import Link from "next/link";
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
  Users,
  UserSearchIcon,
} from "lucide-react";

import DataTableRow from "@/components/DataTableRow";

import dayjs from "dayjs";
import { useGetAllPatients } from "@/lib/tanstack-query/patients/Queries";
import DeleteDialog from "@/components/shared/DeleteDialog";
import { useDeletePatient } from "@/lib/tanstack-query/patients/Mutations";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export type Patient = {
  id: string | number;
  name: string;
  created_on: string | number;
  age: number;
  phone: string;
  status: string;
  email: string;
};

export default function PatientList() {
  const { data } = useGetAllPatients({});

  const { mutateAsync: deletePatient, isPending: isDeletingPatient } =
    useDeletePatient();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [openDelete, setOpenDelete] = useState<Patient | null>(null);

  const columns: ColumnDef<Patient>[] = [
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
          className="bg-transparent! data-[state=checked]:bg-primary!"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="bg-transparent! data-[state=checked]:bg-primary!"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Patient Name",
      cell: ({ row }) => {
        const name: string = row.getValue("name");

        return (
          <Link href={`/patients/${row.original.id}`}>
            <div className="font-medium w-full flex items-center gap-3 hover:text-primary">
              <Avatar>
                <AvatarFallback className="border-[0.5px] uppercase">
                  {name?.split(" ")?.[0]?.[0]}
                  {name?.split(" ")?.[1]?.[0] || name?.split(" ")?.[0]?.[1]}
                </AvatarFallback>
              </Avatar>

              <span>{name}</span>
            </div>
          </Link>
        );
      },
    },
    {
      accessorKey: "age",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0!"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Age
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <>{row.getValue("age")}</>,
    },
    {
      accessorKey: "created_at",
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
        <>{dayjs(row.getValue("created_at")).format("DD MMM YYYY")}</>
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
        const patient = row.original;

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

              <Link href={`/patients/${patient.id}`}>
                <DropdownMenuItem className="cursor-pointer">
                  View patient
                </DropdownMenuItem>
              </Link>

              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer"
                onClick={() => setOpenDelete(patient)}
              >
                <TrashIcon size={18} />
                <span>Delete patient</span>
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

          <span className="text-lg font-medium">Patient List</span>
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
            placeholder="Search patients"
            className="w-[400px] h-10"
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
          />

          {/*<Button*/}
          {/*  variant="outline"*/}
          {/*  className="h-10"*/}
          {/*  onClick={() => {*/}
          {/*    if (data && Array.isArray(data))*/}
          {/*      exportToCSV(data, "patient-data.csv");*/}
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

      <CardFooter>
        <DeleteDialog
          open={Boolean(openDelete)}
          isLoading={isDeletingPatient}
          title={`Delete the patient "${openDelete?.name}"?`}
          description={`This action cannot be undone.`}
          onConfirm={async () => {
            await deletePatient({
              documentId: openDelete?.id,
              onSuccess: () => {
                setOpenDelete(null);
              },
            });
          }}
          onCancel={() => {
            setOpenDelete(null);
          }}
        />
      </CardFooter>
    </Card>
  );
}

function DataTable({ table }: { table: TableType<Patient> }) {
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
          {table.getFilteredRowModel().rows.length} patient(s) selected.
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
