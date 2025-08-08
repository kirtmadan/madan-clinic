import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

import AddPatient from "@/components/AddPatient";
import PatientProfile from "@/components/patients/PatientProfile";
import OverdueBalance from "@/components/patients/OverdueBalance";
import PatientAppointments from "@/components/patients/PatientAppointments";

export default async function PatientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full h-full flex items-center justify-end">
        <AddPatient
          trigger={
            <Button>
              <PlusIcon className="size-4" />
              Add Patient
            </Button>
          }
        />
      </div>

      <div className="w-full h-full grid grid-rows-2 gap-4 grid-cols-3">
        <div className="col-span-1">
          <PatientProfile />
        </div>

        <div className="col-span-2">
          <PatientAppointments />
        </div>

        <div className="col-span-1">
          <OverdueBalance />
        </div>

        <div className="col-span-2"></div>
      </div>
    </div>
  );
}
