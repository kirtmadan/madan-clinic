"use client";

import { useState } from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
  type Table as TableType,
  getPaginationRowModel,
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
  SearchIcon,
  BriefcaseMedical,
  PencilIcon,
} from "lucide-react";

import DataTableRow from "@/components/DataTableRow";

import DeleteDialog from "@/components/shared/DeleteDialog";
import { useGetAllTreatmentTemplates } from "@/lib/tanstack-query/treatment-templates/Queries";
import { useDeleteTreatmentTemplate } from "@/lib/tanstack-query/treatment-templates/Mutations";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AddTreatmentTemplate from "@/components/AddTreatmentTemplate";

export type TreatmentTemplate = {
  id: string | number;
  name: string;
  description: string;
  cost: number;
  total_sessions: number;
  minutes_per_session: number;
  active: boolean;
  created_at: string | number;
};

export default function TreatmentTemplatesList() {
  const { data } = useGetAllTreatmentTemplates({});
  const {
    mutateAsync: deleteTreatmentTemplate,
    isPending: isDeletingTemplate,
  } = useDeleteTreatmentTemplate();

  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [openDelete, setOpenDelete] = useState<TreatmentTemplate | null>(null);

  const columns: ColumnDef<TreatmentTemplate>[] = [
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
      id: "name",
      accessorKey: "name",
      header: "Treatment Name",
      cell: ({ row }) => {
        const name: string = row.getValue("name");

        return (
          <div className="font-medium w-full flex items-center gap-3 hover:text-primary">
            <span>{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <Tooltip delayDuration={800}>
          <TooltipTrigger asChild>
            <div className="max-w-xs truncate">
              {row.getValue("description")}
            </div>
          </TooltipTrigger>

          <TooltipContent>
            <p>{row.getValue("description")}</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      accessorKey: "cost",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0!"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Cost
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <>{row.getValue("cost")}</>,
    },
    {
      accessorKey: "total_sessions",
      header: "Total Sessions",
      cell: ({ row }) => {
        return <>{row.getValue("total_sessions")}</>;
      },
    },
    {
      accessorKey: "minutes_per_session",
      header: "Minutes per session",
      cell: ({ row }) => {
        return <>{row.getValue("minutes_per_session")}</>;
      },
    },
    {
      accessorKey: "color",
      header: "Color",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <div
              className="size-5 rounded-sm"
              style={{ backgroundColor: row.getValue("color") }}
            ></div>

            {row.getValue("color")}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: any }) => {
        const template = row.original;

        return (
          <div className="flex items-center gap-2">
            <AddTreatmentTemplate
              trigger={
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <PencilIcon />
                </Button>
              }
              editData={template}
            />

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
                {/*  <DropdownMenuItem className="cursor-pointer">*/}
                {/*    Edit template*/}
                {/*  </DropdownMenuItem>*/}

                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => setOpenDelete(template)}
                >
                  <TrashIcon size={18} />
                  <span>Delete template</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            <BriefcaseMedical />
          </Button>

          <span className="text-lg font-medium">Treatment Templates</span>
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
            placeholder="Search templates"
            className="w-[400px] h-10"
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
          />

          {/*<Button*/}
          {/*  variant="outline"*/}
          {/*  className="h-10"*/}
          {/*  onClick={() => {*/}
          {/*    // @ts-expect-error - data will always be an array*/}
          {/*    exportToCSV(data, "treatment-templates.csv");*/}
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
          isLoading={isDeletingTemplate}
          title={`Delete the template "${openDelete?.name}"?`}
          description={`This action cannot be undone.`}
          onConfirm={async () => {
            await deleteTreatmentTemplate({
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

function DataTable({ table }: { table: TableType<TreatmentTemplate> }) {
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
        {/*  {table.getFilteredRowModel().rows.length} template(s) selected.*/}
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
