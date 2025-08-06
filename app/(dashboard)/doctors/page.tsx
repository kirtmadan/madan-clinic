import DoctorList from "@/components/DoctorList";
import AddDoctor from "@/components/AddDoctor";
import { Button } from "@/components/ui/button";

import { PlusIcon } from "lucide-react";

export default function PatientsPage() {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full h-full flex items-center justify-end">
        <AddDoctor
          trigger={
            <Button>
              <PlusIcon className="size-4" />
              Add Doctor
            </Button>
          }
        />
      </div>

      <DoctorList />
    </div>
  );
}
