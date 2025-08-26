import { Button } from "@/components/ui/button";
import { AlertCircleIcon, PlusIcon } from "lucide-react";

import AddPatient from "@/components/AddPatient";
import PatientProfile from "@/components/patients/PatientProfile";
import OverdueBalance from "@/components/patients/OverdueBalance";
import PatientAppointments from "@/components/patients/PatientAppointments";
import { getData } from "@/lib/actions/supabase.actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function PatientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data: any = await getData({
    tableName: "patients",
    documentId: id,
  });

  if (data?.error) {
    return (
      <div>
        <PatientBreadcrumb id={data?.name} />
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle className="font-medium text-lg">
            Error : Failed to fetch the patient details.
          </AlertTitle>
          <AlertDescription>
            <p>This can happen due to following reasons : </p>
            <ul className="list-inside list-disc text-sm">
              <li>Patient does not exist</li>
              <li>Ensure that you are connected to the internet</li>
              <li>Error in the database</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full h-full flex items-center justify-end">
        <PatientBreadcrumb className="p-0" id={data?.name} />

        <AddPatient
          trigger={
            <Button>
              <PlusIcon className="size-4" />
              Add Patient
            </Button>
          }
        />
      </div>

      <div className="w-full grid gap-4 grid-cols-3">
        <div className="col-span-1">
          <PatientProfile
            id={id}
            name={data?.name}
            age={data?.age}
            gender={data?.gender}
            address={data?.address}
            email={data?.email}
            createdAt={data?.created_at}
            phone={data?.phone}
          />
        </div>

        <div className="col-span-2 flex flex-col gap-4">
          <OverdueBalance
            overdueAmount={data?.overdue_amount}
            overdueUpdatedAt={data?.overdue_updated_at}
          />

          <PatientAppointments id={id} />
        </div>
      </div>
    </div>
  );
}

function PatientBreadcrumb({
  className,
  id,
}: {
  className?: string;
  id: string;
}) {
  return (
    <div className={cn("w-full h-full pb-4", className)}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/patients">Patients</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>{id || ""}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
