import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { useUpdateAppointment } from "@/lib/tanstack-query/appointments/Mutations";
import { Input } from "@/components/ui/input";

export default function AppointmentNotes({
  id,
  notes,
}: {
  id: string;
  notes: string;
}) {
  const [edit, setEdit] = useState<boolean>(false);
  const { mutateAsync: updateAppointment, isPending } = useUpdateAppointment();

  const handleEdit = async (e: any) => {
    try {
      await updateAppointment({
        documentId: id,
        doc: { notes: e.target.value },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setEdit(false);
    }
  };

  return (
    <div className="w-full h-full border p-4 border-dashed flex flex-col gap-4 rounded-lg">
      <div className="w-full h-full flex gap-4 rounded-lg justify-between items-center">
        <span className="text-sm">Appointment Remarks</span>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="size-6 [&_svg]:size-3"
              onClick={() => setEdit(true)}
              disabled={isPending}
            >
              <PencilIcon />
            </Button>
          </TooltipTrigger>

          <TooltipContent>
            <p>Edit appointment remarks</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {edit ? (
        <Input
          className="w-full py-5"
          defaultValue={notes}
          onBlur={handleEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              void handleEdit(e);
            }
          }}
        />
      ) : (
        <p className="text-sm text-muted-foreground">{notes}</p>
      )}
    </div>
  );
}
