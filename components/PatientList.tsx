"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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
import DeleteDialog from "@/components/shared/DeleteDialog";
import { useDeletePatient } from "@/lib/tanstack-query/patients/Mutations";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { PATIENT_QUERY_KEYS } from "@/lib/tanstack-query/patients/Keys";
import { getCollectionData } from "@/lib/actions/supabase.actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type Patient = {
  id: string | number;
  name: string;
  created_on: string | number;
  age: number;
  phone: string;
  status: string;
  // email: string;
};

export default function PatientList() {
  const [selectedStatus, setSelectedStatus] = useState<string>("active");

  const { data } = useQuery({
    queryKey: [PATIENT_QUERY_KEYS.GET_ALL_PATIENTS, selectedStatus],
    queryFn: async () => {
      const res = await getCollectionData({
        tableName: "patients",
        select: `
              id,
              name,
              age,
              gender,
              phone,
              address,
              created_at,
              patient_number,
              charge_fee,
              treatment_plans (
                id,
                treatment_plan_items (
                  treatment_id,
                  treatments (
                    id,
                    name,
                    color
                  )
                )
              )
              `,
        filters: [(query: any) => query.eq("status", selectedStatus)],
      });

      if (Array.isArray(res)) {
        return res;
      } else {
        return { error: "Error fetching patients" };
      }
    },
  });

  const { mutateAsync: deletePatient, isPending: isDeletingPatient } =
    useDeletePatient();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    uniqueTemplates: false,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [openDelete, setOpenDelete] = useState<Patient | null>(null);

  const columns: ColumnDef<Patient>[] = [
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
      accessorKey: "patient_number",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0!"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Patient Number
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <># {row.getValue("patient_number")}</>,
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
                  {name?.toUpperCase()?.split(" ")?.[0]?.[0]}
                  {name?.toUpperCase()?.split(" ")?.[1]?.[0] ||
                    name?.split(" ")?.[0]?.[1]}
                </AvatarFallback>
              </Avatar>

              <span>{name?.toUpperCase()}</span>
            </div>
          </Link>
        );
      },
    },
    {
      accessorKey: "age",
      header: "Age",
      cell: ({ row }) => <>{row.getValue("age")}</>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => {
        return <>{row.getValue("phone")}</>;
      },
    },
    // {
    //   accessorKey: "email",
    //   header: "Email",
    //   cell: ({ row }) => {
    //     return <>{row.getValue("email")}</>;
    //   },
    // },
    {
      accessorKey: "treatment_plans",
      header: "Treatments",
      cell: ({ row }) => {
        const r: any[] = row?.getValue("treatment_plans") || [];
        const arrayToMap = (Array.isArray(r) ? r : []).filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.id === item?.id),
        );
        return (
          <div>
            {arrayToMap?.map((item: any, index: number) => (
              <div key={index} className="inline-flex items-center gap-2">
                <span
                  className="size-3 inline-block rounded-full"
                  style={{ backgroundColor: item?.color }}
                />

                <span className="mr-2 text-xs">
                  {item?.name}
                  {arrayToMap?.length > 1 && arrayToMap?.length - 1 !== index
                    ? ","
                    : null}
                </span>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => {
        return <span className="capitalize">{row.getValue("gender")}</span>;
      },
    },
    {
      accessorKey: "created_at",
      header: "Created On",
      cell: ({ row }) => (
        <>{dayjs(row.getValue("created_at")).format("DD MMM YYYY")}</>
      ),
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

    {
      accessorKey: "uniqueTemplates",
      header: "Treatments",
      cell: ({ row }) => {
        return (
          <span className="capitalize">{row.getValue("uniqueTemplates")}</span>
        );
      },
    },
  ];

  const modifiedData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data.map((p) => {
      const templates = p?.treatment_plans
        ?.flatMap((tp: any) => tp?.treatment_plan_items || [])
        ?.map((tpi: any) => tpi?.treatments?.name)
        ?.filter(Boolean);

      const treatment_plans = p?.treatment_plans
        ?.flatMap((tp: any) => tp?.treatment_plan_items || [])
        ?.map((tpi: any) => {
          return { treatment_id: tpi?.treatment_id, ...tpi?.treatments };
        })
        ?.filter(Boolean);

      const uniqueTemplates = [...new Set(templates)].join(" ");

      return {
        ...p,
        treatment_plans,
        uniqueTemplates,
      };
    });
  }, [data]);

  const table = useReactTable({
    data: Array.isArray(modifiedData) ? modifiedData : [],
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

          <span className="text-lg font-medium">
            {selectedStatus === "completed" && (
              <span className="capitalize">{selectedStatus}</span>
            )}{" "}
            Patient List
          </span>
        </CardTitle>

        <div className="flex items-center gap-6">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent>
              {["active", "completed"].map((st) => (
                <SelectItem key={st} value={st}>
                  <div className="flex items-center gap-2 capitalize">
                    <span
                      className={cn(
                        "size-3 rounded-full",
                        st === "completed" ? "bg-green-400" : "bg-orange-400",
                      )}
                    ></span>
                    {st}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
        {/*<div className="text-muted-foreground flex-1 text-sm">*/}
        {/*  {table.getFilteredSelectedRowModel().rows.length} of{" "}*/}
        {/*  {table.getFilteredRowModel().rows.length} patient(s) selected.*/}
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
