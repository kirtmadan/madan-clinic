"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { CalendarIcon, XIcon } from "lucide-react";
import { useGetAllPatients } from "@/lib/tanstack-query/patients/Queries";
import { useGetAllDoctors } from "@/lib/tanstack-query/doctors/Queries";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { useAddAppointment } from "@/lib/tanstack-query/appointments/Mutations";
import day from "@/lib/day";
import { useIsMobile } from "@/hooks/use-mobile";

const formSchema = z.object({
  doctor_id: z.string().min(1, "Please select a doctor"),
  patient_id: z.string().min(1, "Please select a patient"),
  notes: z
    .string()
    .max(256, "Notes must be less than 256 characters")
    .optional(),
  date: z.date({ error: "Date is required for the appointment" }),
  status: z.string(),
});

interface CreateAppointmentFormProps {
  onCancel: () => void;
}

interface CreateAppointmentFormWithModalProps {
  trigger: React.ReactNode;
}

export default function CreateAppointmentFormWithDrawer({
  trigger,
}: CreateAppointmentFormWithModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent className="max-w-xl">
        <DrawerHeader className="border-b flex-row w-full justify-between items-center">
          <DrawerTitle className="font-medium">Add Appointment</DrawerTitle>
          <DrawerClose className="cursor-pointer" ref={closeRef}>
            <XIcon className="size-4" />
          </DrawerClose>
        </DrawerHeader>

        <CreateAppointmentForm onCancel={() => closeRef.current?.click()} />
      </DrawerContent>
    </Drawer>
  );
}

// export function CreateAppointmentFormWithModal({}: CreateAppointmentFormWithModalProps) {
//   return (
//     <Dialog open>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle className="scroll-my-20 text-xl font-medium">
//             Create Appointment
//           </DialogTitle>
//         </DialogHeader>
//
//         <CreateAppointmentForm
//           onSubmit={onSubmit}
//           onCancel={() => {}}
//           // onCancel={() => closeRef.current?.click()}
//         />
//       </DialogContent>
//     </Dialog>
//   );
// }

export function CreateAppointmentForm({
  onCancel,
}: CreateAppointmentFormProps) {
  const { mutateAsync: addAppointment } = useAddAppointment();

  const { data: patientsData } = useGetAllPatients({});
  const { data: doctorsData } = useGetAllDoctors({});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      doctor_id: "",
      patient_id: "",
      date: undefined,
      status: "scheduled",
      notes: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    await addAppointment({
      doc: {
        ...values,
        created_at: new Date().toISOString(),
      },
      onSuccess: () => {
        onCancel?.();
        form.reset();
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full p-4 overflow-y-auto"
      >
        <FormField
          control={form.control}
          name="doctor_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor</FormLabel>

              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {(Array.isArray(doctorsData) ? doctorsData : [])?.map(
                      (doctor) => (
                        <SelectItem value={doctor?.id} key={doctor?.id}>
                          <Avatar>
                            <AvatarFallback>
                              {doctor?.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>

                          {doctor.name}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="patient_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient</FormLabel>

              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {(Array.isArray(patientsData) ? patientsData : []).map(
                      (patient) => (
                        <SelectItem value={patient?.id} key={patient?.id}>
                          <Avatar>
                            <AvatarFallback className="uppercase">
                              {patient.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          {patient.name} - {patient.phone}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        dayjs(field.value).format("dddd, DD MMMM, YYYY")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => {
                      return !day(date).isToday() && date < new Date();
                    }}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>

              <FormControl>
                <Textarea
                  className="max-h-40"
                  placeholder="Enter appointment notes (Optional)"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>

          <Button type="submit">Create Appointment</Button>
        </div>
      </form>
    </Form>
  );
}
