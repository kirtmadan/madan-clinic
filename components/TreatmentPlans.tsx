"use client";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { InputWithIcon } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ArrowUpDown, SearchIcon, WavesIcon } from "lucide-react";

import DataTableRow from "@/components/DataTableRow";

import dayjs from "dayjs";
import { useGetAllTreatmentPlans } from "@/lib/tanstack-query/treatment-plans/Queries";
import TreatmentPlanDrawer from "@/components/treatment-plans/TreatmentPlanDrawer";

export type TreatmentPlan = {
  id: string | number;
  description: string;
  created_at: string | number;
  updated_at: string | number;
  status: string;
  treatment_plan_items: any[];
};

export default function TreatmentPlans({ patientId }: { patientId: string }) {
  const { data } = useGetAllTreatmentPlans({
    select: `
    id,
    description,
    created_at,
    updated_at,
    status,
    paid_total,
    patient:patient_id( 
      id, 
      name
    ),
    authorized_amount,
    treatment_plan_items(
      t:treatment_id (
        id,
        name,
        color
      ),
      quantity,
      recorded_unit_price
    )
    `,
    filters: [(query: any) => query.eq("patient_id", patientId)],
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<TreatmentPlan>[] = [
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
      header: "Plan ID",
      cell: ({ row }) => {
        return (
          <TreatmentPlanDrawer
            trigger={<span># {row.getValue("id")}</span>}
            planData={row?.original}
          />
        );
      },
    },
    {
      accessorKey: "treatment_plan_items",
      header: "Treatments",
      cell: ({ row }) => {
        const r = row?.getValue("treatment_plan_items") || [];
        console.log(r);

        return (
          <div>
            {(Array.isArray(r) ? r : [])
              .filter(
                (item, index, self) =>
                  index === self.findIndex((t) => t?.t?.id === item?.t?.id),
              )
              .map((item: any, index: number) => (
                <div key={index} className="inline-flex items-center gap-2">
                  <span
                    className="size-3 inline-block rounded-full"
                    style={{ backgroundColor: item?.t?.color }}
                  />
                  <span className="mr-2">{item?.t?.name},</span>
                </div>
              ))}
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <>{row.getValue("description")}</>,
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
      accessorKey: "updated_at",
      header: "Updated On",
      cell: ({ row }) => (
        <>
          {dayjs(
            row.getValue("updated_at") || row.getValue("created_at"),
          ).format("DD MMM YYYY")}
        </>
      ),
    },
    // {
    //   accessorKey: "status",
    //   header: "Status",
    //   cell: ({ row }) => {
    //     return (
    //       <AppointmentStatusRenderer status={row.getValue("status")}>
    //         {row.getValue("status")}
    //       </AppointmentStatusRenderer>
    //     );
    //   },
    // },
    // {
    //   id: "actions",
    //   enableHiding: false,
    //   cell: ({ row }: { row: any }) => {
    //     return (
    //       <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button variant="ghost" className="h-8 w-8 p-0">
    //             <span className="sr-only">Open menu</span>
    //             <MoreHorizontal />
    //           </Button>
    //         </DropdownMenuTrigger>
    //
    //         <DropdownMenuContent align="end">
    //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //           <DropdownMenuSeparator />
    //
    //           {/*<Link href={`/patients/${patient.id}`}>*/}
    //           {/*</Link>*/}
    //
    //           <DropdownMenuItem className="cursor-pointer">
    //             <PenIcon size={18} />
    //             Edit plan
    //           </DropdownMenuItem>
    //
    //           {/*<DropdownMenuItem*/}
    //           {/*  variant="destructive"*/}
    //           {/*  className="cursor-pointer"*/}
    //           {/*  onClick={() => setOpenDelete(patient)}*/}
    //           {/*>*/}
    //           {/*  <TrashIcon size={18} />*/}
    //           {/*  <span>Delete patient</span>*/}
    //           {/*</DropdownMenuItem>*/}
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     );
    //   },
    // },
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
            <WavesIcon />
          </Button>

          <span className="text-lg font-medium">Treatment Plans</span>
        </CardTitle>

        <div className="flex items-center gap-6">
          <InputWithIcon
            type="text"
            StartIcon={
              <SearchIcon
                className="text-muted-foreground pointer-events-none absolute left-2 top-1/2 -translate-y-1/2"
                size={18}
              />
            }
            placeholder="Search treatment plans"
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

      {/*<CardFooter></CardFooter>*/}
    </Card>
  );
}

function DataTable({ table }: { table: TableType<TreatmentPlan> }) {
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
