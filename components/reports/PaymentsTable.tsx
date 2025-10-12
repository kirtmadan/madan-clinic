"use client";

import GridComponent from "@/components/shared/AgGrid";
import { useCallback, useEffect, useRef, useState } from "react";
import { IsFullWidthRowParams } from "ag-grid-community";
import type { CustomCellRendererProps } from "ag-grid-react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";

export default function PaymentsTable({ events }: { events: any[] }) {
  const gridRef = useRef<any>(null);
  const [data, setData] = useState<any[]>([]);

  const columnDefs = [
    {
      field: "date",
      headerName: "Date",
      width: 150,
      flex: 0,
      valueFormatter: (params: any) =>
        dayjs(params.value).format("DD MMM YYYY"),
    },
    {
      field: "name",
      headerName: "Patient Name",
    },
    {
      field: "amount",
      headerName: "Amount",
    },
    {
      field: "total",
      headerName: "Total",
      hide: true,
    },
  ];

  useEffect(() => {
    if (!events?.length) return;
    const result: {
      date: string;
      name?: string;
      amount?: number;
      total?: number;
    }[] = [];

    events.forEach((entry) => {
      const { date, ...patients } = entry;
      let dailyTotal = 0;

      for (const [name, amount] of Object.entries(patients)) {
        result.push({ name, amount: amount as number, date });
        dailyTotal += amount as number;
      }

      // Check if this date already has a total entry
      const existingTotal = result?.find(
        (r) => r.date === date && r.total !== undefined,
      );

      if (existingTotal?.total) {
        existingTotal.total += dailyTotal;
      } else {
        result.push({ date, total: dailyTotal });
      }
    });

    setData(result);
  }, [events]);

  const onBtnExport = useCallback(() => {
    gridRef.current!.api.exportDataAsCsv();
  }, []);

  const isFullWidthRow = useCallback((params: IsFullWidthRowParams) => {
    return Boolean(params.rowNode.data?.total);
  }, []);

  return (
    <>
      <div className="flex items-center justify-end w-full">
        <Button variant="outline" onClick={onBtnExport}>
          <DownloadIcon />
          Export Data
        </Button>
      </div>

      <div className="h-[500px] w-full">
        <GridComponent
          defaultColDef={{
            flex: 1,
          }}
          rowData={data}
          columnDefs={columnDefs}
          forwardedRef={gridRef}
          pagination
          paginationPageSize={50}
          isFullWidthRow={isFullWidthRow}
          fullWidthCellRenderer={fullWidthCellRenderer}
          animateRows
          defaultCsvExportParams={{
            allColumns: true,
          }}
        />
      </div>
    </>
  );
}

function fullWidthCellRenderer(props: CustomCellRendererProps) {
  const { total } = props.data;

  return (
    <div className="flex w-full items-center gap-2 pt-4 px-4 font-medium">
      <span className="">Total :</span>
      {total}
    </div>
  );
}
