"use client";

import { useCallback, useRef } from "react";
import GridComponent from "@/components/shared/AgGrid";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";

export default function PendingPaymentsTable({
  events,
  title,
}: {
  events: any[];
  title?: string;
}) {
  const gridRef = useRef<any>(null);

  const columnDefs = [
    {
      field: "patient.name",
      headerName: "Patient Name",
    },
    {
      field: "outstanding",
      headerName: "Pending Amount",
    },
  ];

  const onBtnExport = useCallback(() => {
    gridRef.current!.api.exportDataAsCsv();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between w-full">
        {title && <h3 className="font-medium">{title}</h3>}

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
          rowData={events}
          columnDefs={columnDefs}
          forwardedRef={gridRef}
          pagination
          paginationPageSize={50}
          animateRows
          defaultCsvExportParams={{
            allColumns: true,
          }}
        />
      </div>
    </>
  );
}
