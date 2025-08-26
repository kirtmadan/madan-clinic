import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

import AddTreatmentTemplate from "@/components/AddTreatmentTemplate";
import TreatmentTemplatesList from "@/components/TreatmentTemplatesList";

export default function TreatmentTemplatesPage() {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full h-full flex items-center justify-end">
        <AddTreatmentTemplate
          trigger={
            <Button>
              <PlusIcon className="size-4" />
              Add Template
            </Button>
          }
        />
      </div>

      <TreatmentTemplatesList />
    </div>
  );
}
