import { Button } from "@/components/ui/button";
import { AlertCircleIcon, CalendarPlusIcon, PlusIcon } from "lucide-react";

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
import TreatmentPlans from "@/components/TreatmentPlans";
import AddTreatmentPlan from "@/components/AddTreatmentPlan";

export default async function PatientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data: any = await getData({
    tableName: "patients",
    documentId: id,
    select: `
    id,
    name,
    age,
    gender,
    patient_number,
    address,
    email,  
    phone,
    created_at,
    treatment_plans (
      id,
      authorized_amount,
      status,
      paid_total,
      treatment_plan_items (
        quantity,
        recorded_unit_price
      )
    )
    `,
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

  const totalOverdueAmount = data?.treatment_plans
    ?.filter((plan: any) => plan?.status !== "paid") // exclude fully paid
    ?.reduce((grandTotal: number, plan: any) => {
      // Decide whether to use authorized_amount or compute from items
      const planAuthorizedOrCalc =
        plan?.authorized_amount ??
        plan?.treatment_plan_items?.reduce(
          (total: number, item: any) =>
            total + item?.quantity * item?.recorded_unit_price,
          0,
        );

      let overdue = 0;

      if (plan?.status === "partially_paid") {
        overdue = planAuthorizedOrCalc - (plan?.paid_total ?? 0);
      } else {
        // for unpaid → take full amount
        overdue = planAuthorizedOrCalc;
      }

      return grandTotal + overdue;
    }, 0);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full h-full flex gap-4 flex-col md:flex-row md:items-center justify-end">
        <PatientBreadcrumb className="p-0" id={data?.name} />

        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <AddPatient
            trigger={
              <Button variant="outline">
                <PlusIcon className="size-4" />
                Add Patient
              </Button>
            }
          />

          <AddTreatmentPlan
            patientId={id}
            trigger={
              <Button>
                <CalendarPlusIcon className="size-4" />
                Add Treatment Plan
              </Button>
            }
          />
        </div>
      </div>

      <div className="w-full grid gap-4 grid-cols-1 md:grid-cols-3">
        <PatientProfile
          id={id}
          name={data?.name}
          age={data?.age}
          gender={data?.gender}
          patient_number={data?.patient_number}
          address={data?.address}
          email={data?.email}
          createdAt={data?.created_at}
          phone={data?.phone}
        />

        <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
          <OverdueBalance
            overdueAmount={totalOverdueAmount || 0}
            overdueUpdatedAt={data?.overdue_updated_at}
          />

          <PatientAppointments id={id} />
        </div>

        <div className="w-full col-span-1 md:col-span-3">
          <TreatmentPlans patientId={id} />
        </div>

        {/*<div className="w-full col-span-3">*/}
        {/*  <PatientPayments id={id} />*/}
        {/*</div>*/}
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
