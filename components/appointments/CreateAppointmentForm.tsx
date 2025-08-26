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
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useRef, useState } from "react";
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
import { useGetAllTreatmentTemplates } from "@/lib/tanstack-query/treatment-templates/Queries";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
import { useAddAppointment } from "@/lib/tanstack-query/appointments/Mutations";

const formSchema = z.object({
  doctor_id: z.string().min(1, "Please select a doctor"),
  patient_id: z.string().min(1, "Please select a patient"),
  amount_to_charge: z
    .string()
    .min(1, "Please enter a valid amount to charge")
    .refine((val) => !isNaN(Number(val)), {
      message: "Please enter a valid amount",
    }),
  notes: z.string().max(256, "Notes must be less than 256 characters"),
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

  return (
    <Drawer direction="right">
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
  const { data: treatmentTemplates } = useGetAllTreatmentTemplates({});

  const [template, setTemplate] = useState<any>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      doctor_id: "",
      patient_id: "",
      amount_to_charge: "",
      date: undefined,
      status: "scheduled",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    await addAppointment({
      doc: {
        ...values,
        amount_to_charge: Number(values.amount_to_charge),
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
        className="space-y-6 w-full p-4"
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
        <div className="border bg-primary/85 rounded-md w-full p-4 border-dashed flex flex-col gap-2">
          <p className="text-sm text-primary-foreground">Amount to charge</p>

          <Select
            onValueChange={(value: string) => {
              setTemplate(value);

              if (treatmentTemplates && Array.isArray(treatmentTemplates)) {
                const obj = treatmentTemplates?.find((x) => x?.id === value);
                form.setValue("amount_to_charge", obj?.cost?.toString());
                form.clearErrors("amount_to_charge");
              }
            }}
            value={template}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select a treatment template" />
            </SelectTrigger>

            <SelectContent>
              {(Array.isArray(treatmentTemplates)
                ? treatmentTemplates
                : []
              ).map((template) => (
                <SelectItem value={template?.id} key={template?.id}>
                  <div
                    className="size-4 rounded-sm"
                    style={{ backgroundColor: template?.color }}
                  ></div>
                  {template?.name} - ₹ {template?.cost}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="flex items-center justify-center text-primary-foreground text-sm p-2 border border-dashed my-1 rounded-md">
            OR
          </span>

          <FormField
            control={form.control}
            name="amount_to_charge"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    className="bg-white"
                    placeholder="Enter the amount manually"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setTemplate("");
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
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
