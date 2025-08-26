import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import AddLabOrder from "@/components/AddLabOrder";
import LabOrdersTable from "@/components/lab-orders/LabOrdersTable";

export default function LabOrdersPage() {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full h-full flex items-center justify-end">
        <AddLabOrder
          trigger={
            <Button>
              <PlusIcon className="size-4" />
              New Lab Order
            </Button>
          }
        />
      </div>

      <LabOrdersTable />
    </div>
  );
}
