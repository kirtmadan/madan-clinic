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

import { useEffect, useRef, useState } from "react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { CalendarIcon, Check, ChevronDown, XIcon } from "lucide-react";
import { useGetAllPatients } from "@/lib/tanstack-query/patients/Queries";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
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
  patientId?: string;
}

interface CreateAppointmentFormWithModalProps {
  trigger: React.ReactNode;
  patientId?: string;
}

export default function CreateAppointmentFormWithDrawer({
  trigger,
  patientId,
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

        <CreateAppointmentForm
          patientId={patientId}
          onCancel={() => closeRef.current?.click()}
        />
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
  patientId,
}: CreateAppointmentFormProps) {
  const { mutateAsync: addAppointment } = useAddAppointment();

  const { data: patientsData } = useGetAllPatients({ all: true });

  const [openPatientList, setOpenPatientList] = useState<boolean>(false);
  const [duplError, setDuplError] = useState(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient_id: "",
      date: undefined,
      status: "scheduled",
      notes: undefined,
    },
  });

  useEffect(() => {
    if (patientId && Array.isArray(patientsData)) {
      form.reset({
        ...form.getValues(), // keep existing values
        patient_id: patientId,
      });

      form.clearErrors("patient_id");
    }
  }, [patientId, patientsData, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await addAppointment({
      doc: {
        ...values,
        date: dayjs(values.date).format("YYYY-MM-DD"),
        created_at: new Date().toISOString(),
      },
      onSuccess: () => {
        onCancel?.();
        form.reset();
      },
    });

    // if (res?.errcode === 3) {
    //   setDuplError(res?.doc);
    // }
  }

  async function forcedSubmit(values: any) {
    console.log(values);

    await addAppointment({
      doc: {
        ...values,
        date: dayjs(values.date).format("YYYY-MM-DD"),
        created_at: new Date().toISOString(),
      },
      forced: true,
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
        {/*<FormField*/}
        {/*  control={form.control}*/}
        {/*  name="doctor_id"*/}
        {/*  disabled={Boolean(duplError)}*/}
        {/*  render={({ field }) => (*/}
        {/*    <FormItem>*/}
        {/*      <FormLabel>Doctor</FormLabel>*/}

        {/*      <FormControl>*/}
        {/*        <Select*/}
        {/*          onValueChange={field.onChange}*/}
        {/*          defaultValue={field.value}*/}
        {/*          disabled={Boolean(duplError)}*/}
        {/*        >*/}
        {/*          <FormControl>*/}
        {/*            <SelectTrigger className="w-full">*/}
        {/*              <SelectValue placeholder="Select a doctor" />*/}
        {/*            </SelectTrigger>*/}
        {/*          </FormControl>*/}

        {/*          <SelectContent>*/}
        {/*            {(Array.isArray(doctorsData) ? doctorsData : [])?.map(*/}
        {/*              (doctor) => (*/}
        {/*                <SelectItem value={doctor?.id} key={doctor?.id}>*/}
        {/*                  <Avatar>*/}
        {/*                    <AvatarFallback>*/}
        {/*                      {doctor?.name.slice(0, 2)}*/}
        {/*                    </AvatarFallback>*/}
        {/*                  </Avatar>*/}

        {/*                  {doctor.name}*/}
        {/*                </SelectItem>*/}
        {/*              ),*/}
        {/*            )}*/}
        {/*          </SelectContent>*/}
        {/*        </Select>*/}
        {/*      </FormControl>*/}
        {/*    </FormItem>*/}
        {/*  )}*/}
        {/*/>*/}

        <FormField
          control={form.control}
          name="patient_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient</FormLabel>

              <Popover
                open={openPatientList}
                onOpenChange={setOpenPatientList}
                modal={true}
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openPatientList}
                      disabled={Boolean(duplError)}
                      className="w-full justify-between font-normal text-muted-foreground"
                    >
                      {field.value
                        ? (patientsData as any[])?.find(
                            (x: any) => x?.id === field.value,
                          )?.name
                        : "Select a patient"}
                      <ChevronDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search patients..."
                      className="h-10"
                    />

                    <CommandList>
                      <CommandEmpty>No patients found.</CommandEmpty>

                      <CommandGroup>
                        {(Array.isArray(patientsData) ? patientsData : []).map(
                          (patient) => (
                            <CommandItem
                              key={patient?.id}
                              value={patient?.name}
                              onSelect={() => {
                                field.onChange(patient?.id);

                                setOpenPatientList(false);
                              }}
                            >
                              {patient?.name} - {patient?.phone}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  field?.value === patient?.id
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ),
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
                      disabled={Boolean(duplError)}
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
                    endMonth={new Date(2050, 11)}
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
              <FormLabel>Remarks</FormLabel>

              <FormControl>
                <Textarea
                  disabled={Boolean(duplError)}
                  className="max-h-40"
                  placeholder="Enter appointment remarks (Optional)"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {Boolean(duplError) && (
          <Alert variant="destructive">
            <AlertTitle>This patient is already appointed</AlertTitle>

            <AlertDescription>
              Are you sure you want to re-appoint? This will create a duplicate
              entry!
            </AlertDescription>

            <div className="flex items-center gap-4 w-full pt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDuplError(null)}
              >
                No
              </Button>

              <Button
                size="sm"
                onClick={async () => {
                  await forcedSubmit(duplError);
                }}
              >
                Yes
              </Button>
            </div>
          </Alert>
        )}

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
