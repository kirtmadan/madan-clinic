"use client";

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

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon, MapPinIcon, PhoneIcon, XIcon } from "lucide-react";
import { useRef } from "react";

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
  phone: z
    .string()
    .max(10, { message: "Phone number can contain more than 10 digits" }),
  email: z.string().email({ message: "Invalid email address" }),
  address: z
    .string()
    .max(264, { message: "Address must be less than 264 characters" }),
});

interface AddPatientProps {
  trigger: React.ReactNode;
}

export default function AddPatient({ trigger }: AddPatientProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent className="max-w-xl">
        <DrawerHeader className="border-b flex-row w-full justify-between items-center">
          <DrawerTitle className="font-medium">Add Patient</DrawerTitle>
          <DrawerClose className="cursor-pointer" ref={closeRef}>
            <XIcon className="size-4" />
          </DrawerClose>
        </DrawerHeader>

        <AddPatientForm onCancel={() => closeRef.current?.click()} />
      </DrawerContent>
    </Drawer>
  );
}

interface AddPatientFormProps {
  onCancel?: () => void;
}

export function AddPatientForm({ onCancel }: AddPatientFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      age: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 px-4 py-6"
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
                <FormLabel>Email Address</FormLabel>
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
                <FormLabel>Address (Optional)</FormLabel>
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
