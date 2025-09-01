"use client";

import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, InputWithIcon } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MapPinIcon, PhoneIcon, XIcon } from "lucide-react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  useAddPatient,
  useUpdatePatient,
} from "@/lib/tanstack-query/patients/Mutations";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { useIsMobile } from "@/hooks/use-mobile";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Patient name is required" })
    .max(50, { message: "Patient name must be less than 50 characters" }),
  age: z
    .string()
    .min(1, {
      message: "Please enter a valid age",
    })
    .refine((val) => !isNaN(Number(val)), {
      message: "Please enter a valid age",
    })
    .refine((val) => Number(val) < 110, {
      message: "Please enter a valid age",
    }),
  gender: z.string().min(1, {
    message: "Gender is a required field",
  }),
  phone: z.string().min(10, { message: "Enter a valid phone number" }),
  address: z
    .string()
    .min(1, { message: "Address is required" })
    .max(264, { message: "Address must be less than 264 characters" }),
  charge_fee: z.boolean(),
});

interface AddPatientProps {
  trigger: React.ReactNode;
  editData?: any;
}

export default function AddPatient({ trigger, editData }: AddPatientProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const mode = editData ? "edit" : "add";

  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent className="md:max-w-xl">
        <DrawerHeader className="border-b flex-row w-full justify-between items-center">
          <DrawerTitle className="font-medium capitalize">
            {mode} Patient
          </DrawerTitle>
          <DrawerClose className="cursor-pointer" ref={closeRef}>
            <XIcon className="size-4" />
          </DrawerClose>
        </DrawerHeader>

        <AddPatientForm
          editData={editData}
          onCancel={() => closeRef.current?.click()}
        />
      </DrawerContent>
    </Drawer>
  );
}

interface AddPatientFormProps {
  onCancel?: () => void;
  editData?: any;
}

export function AddPatientForm({ onCancel, editData }: AddPatientFormProps) {
  const router = useRouter();

  const { mutateAsync: addPatient } = useAddPatient();
  const { mutateAsync: updatePatient } = useUpdatePatient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      age: "",
      gender: "",
      address: "",
      charge_fee: false,
    },
  });

  useEffect(() => {
    if (editData) {
      form.reset({
        name: editData?.name,
        phone: editData?.phone,
        age: editData?.age?.toString(),
        gender: editData?.gender,
        address: editData?.address,
      });
    }
  }, [editData, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (editData) {
      return await updatePatient({
        doc: {
          address: values.address,
          age: Number(values.age),
          gender: values.gender,
          name: values.name,
          phone: values.phone,
        },
        documentId: editData?.id,
        onSuccess: () => {
          onCancel?.();
          form.reset();
          router.refresh();
        },
      });
    }

    return await addPatient({
      doc: {
        address: values.address,
        age: Number(values.age),
        gender: values.gender,
        name: values.name,
        phone: values.phone,
        created_at: new Date().toISOString(),
      },
      onSuccess: () => {
        onCancel?.();
        form.reset();
      },
    });
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 px-4 py-6 overflow-y-auto"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name of the patient" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <InputWithIcon
                    placeholder="Enter the age of the patient"
                    type="number"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    key={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full cursor-pointer capitalize">
                        <SelectValue placeholder="Select the gender of the patient" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {["male", "female", "transgender"].map((gen: string) => (
                        <SelectItem
                          key={gen}
                          value={gen}
                          className="capitalize! cursor-pointer"
                        >
                          {gen}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <InputWithIcon
                    placeholder="Enter phone number"
                    StartIcon={
                      <PhoneIcon
                        className="text-muted-foreground pointer-events-none absolute left-2 top-1/2 -translate-y-1/2"
                        size={16}
                      />
                    }
                    type="number"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <InputWithIcon
                    StartIcon={
                      <MapPinIcon
                        className="text-muted-foreground pointer-events-none absolute left-2 top-1/2 -translate-y-1/2"
                        size={16}
                      />
                    }
                    placeholder="Enter address"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {!editData && (
            <FormField
              control={form.control}
              name="charge_fee"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Charge Fee</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          <div className="w-full flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onCancel?.();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </>
  );
}
