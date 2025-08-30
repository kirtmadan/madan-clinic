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

import { MailIcon, MapPinIcon, PhoneIcon, XIcon } from "lucide-react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  useAddPatient,
  useUpdatePatient,
} from "@/lib/tanstack-query/patients/Mutations";
import { useRouter } from "next/navigation";

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
  email: z.string().email({ message: "Invalid email address" }).optional(),
  address: z
    .string()
    .min(1, { message: "Address is required" })
    .max(264, { message: "Address must be less than 264 characters" }),
});

interface AddPatientProps {
  trigger: React.ReactNode;
  editData?: any;
}

export default function AddPatient({ trigger, editData }: AddPatientProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const mode = editData ? "edit" : "add";

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent className="max-w-xl">
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
      email: undefined,
      age: "",
      gender: "",
      address: "",
    },
  });

  useEffect(() => {
    if (editData) {
      form.reset({
        name: editData?.name,
        age: editData?.age?.toString(),
        gender: editData?.gender,
        phone: editData?.phone,
        email: editData?.email,
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
          email: values.email,
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
        email: values.email,
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address (Optional)</FormLabel>
                <FormControl>
                  <InputWithIcon
                    placeholder="Enter email address"
                    type="email"
                    StartIcon={
                      <MailIcon
                        className="text-muted-foreground pointer-events-none absolute left-2 top-1/2 -translate-y-1/2"
                        size={16}
                      />
                    }
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
