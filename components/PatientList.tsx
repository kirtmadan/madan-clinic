"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ArrowDownToLineIcon, ArrowUpDownIcon, Users } from "lucide-react";
import PatientRow from "@/components/PatientRow";
import { patientData } from "@/lib/constants";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function PatientList() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const rowsPerPage = 10;
  const totalPages = patientData.length / rowsPerPage;

  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

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

        <div className="flex items-center gap-4">
          <Input
            type="text"
            placeholder="Search patients"
            className="w-full h-8"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />

          <Button variant="outline" size="sm">
            <ArrowUpDownIcon />
            Sort by
          </Button>

          <Button variant="outline" size="sm">
            <ArrowDownToLineIcon />
            Export
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="px-6 text-muted-foreground">
                Patient Name
              </TableHead>
              <TableHead className="px-6 text-muted-foreground">
                Created On
              </TableHead>
              <TableHead className="px-6 text-muted-foreground">Age</TableHead>
              <TableHead className="px-6 text-muted-foreground">
                Phone
              </TableHead>
              <TableHead className="px-6 text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="px-6 text-muted-foreground">
                Email
              </TableHead>
              <TableHead className="px-6 text-muted-foreground"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {patientData
              .filter((patient: any) => {
                return patient.name.toLowerCase().includes(query.toLowerCase());
              })
              .slice(
                (currentPage - 1) * rowsPerPage,
                (currentPage - 1) * rowsPerPage + rowsPerPage,
              )
              .map((patient: any) => (
                <PatientRow key={patient.id} {...patient} />
              ))}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter>
        <Pagination>
          <PaginationContent>
            {currentPage !== 1 && (
              <PaginationItem
                onClick={() => {
                  handleChangePage(currentPage - 1);
                }}
              >
                <PaginationPrevious />
              </PaginationItem>
            )}

            {[...Array(totalPages).keys()].map((page: number) => (
              <PaginationItem key={page + 1}>
                <PaginationLink
                  onClick={() => {
                    handleChangePage(page + 1);
                  }}
                  isActive={page + 1 === currentPage}
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>

            {currentPage !== totalPages && (
              <PaginationItem
                onClick={() => {
                  handleChangePage(currentPage + 1);
                }}
              >
                <PaginationNext />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}
