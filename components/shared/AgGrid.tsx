"use client";

import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  colorSchemeVariable,
  type GridOptions,
} from "ag-grid-community";
import { ForwardedRef } from "react";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function GridComponent({
  forwardedRef,
  ...props
}: GridOptions & {
  forwardedRef: ForwardedRef<AgGridReact<any>>;
}) {
  return (
    <AgGridReact
      ref={forwardedRef}
      theme={themeQuartz.withPart(colorSchemeVariable).withParams({
        fontFamily: "var(--font-sans)",
        headerFontFamily: "var(--font-sans)",
        borderColor: "var(--border)",
        backgroundColor: "var(--card)",
        foregroundColor: "var(--foreground)",
        headerTextColor: "var(--foreground)",
        headerBackgroundColor: "var(--card)",
        rowVerticalPaddingScale: 1.4,
        headerColumnResizeHandleColor: "var(--secondary)",
        // wrapperBorderRadius: 2,
      })}
      {...props}
    />
  );
}
