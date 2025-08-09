"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SlotInfo } from "react-big-calendar";
import { Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { patientData } from "@/lib/constants";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const formSchema = z.object({
  doctorId: z.string().min(1, "Please select a doctor"),
  patientId: z.string().min(1, "Please select a patient"),
  treatmentId: z.string().min(1, "Please select a treatment"),
  start: z.string(),
});

interface CreateAppointmentFormProps {
  start: Date;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
}

interface CreateAppointmentFormWithModalProps {
  selectedSlot: SlotInfo | null;
  setSelectedSlot: Dispatch<SetStateAction<SlotInfo | null>>;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
}

export function CreateAppointmentFormWithModal({
  selectedSlot,
  setSelectedSlot,
  onSubmit,
}: CreateAppointmentFormWithModalProps) {
  return (
    <Dialog
      open={selectedSlot !== null}
      onOpenChange={() => setSelectedSlot(null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="scroll-my-20 text-xl font-medium">
            Create Appointment
          </DialogTitle>
        </DialogHeader>

        {selectedSlot && (
          <CreateAppointmentForm
            start={selectedSlot.start}
            onSubmit={onSubmit}
            onCancel={() => setSelectedSlot(null)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export function CreateAppointmentForm({
  start,
  onSubmit,
  onCancel,
}: CreateAppointmentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      doctorId: "",
      patientId: "",
      treatmentId: "",
      start: start.toISOString().slice(0, 16),
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full py-4"
      >
        <FormField
          control={form.control}
          name="doctorId"
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
                    {patientData.map((patient) => (
                      <SelectItem value={patient.name} key={patient.email}>
                        <Avatar>
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>

                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="patientId"
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
                    {patientData.map((patient) => (
                      <SelectItem value={patient.name} key={patient.email}>
                        <Avatar>
                          <AvatarFallback className="uppercase">
                            {patient.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="treatmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Treatment</FormLabel>

              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a treatment" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {patientData.map((patient) => (
                      <SelectItem value={patient.name} key={patient.email}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="start"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  className="justify-center"
                  {...field}
                />
              </FormControl>
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
