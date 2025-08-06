import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

import PatientList from "@/components/PatientList";
import AddPatient from "@/components/AddPatient";

export default function PatientsPage() {
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

      <PatientList />
    </div>
  );
}
