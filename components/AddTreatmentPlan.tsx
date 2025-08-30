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
import { Input } from "@/components/ui/input";

import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MinusIcon, PlusIcon, XIcon } from "lucide-react";
import { useRef } from "react";
import { useAddTreatmentPlan } from "@/lib/tanstack-query/treatment-plans/Mutations";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllTreatmentTemplates } from "@/lib/tanstack-query/treatment-templates/Queries";

const planItemSchema = z.object({
  treatment_id: z.string().min(1, { message: "Select a treatment" }),
  quantity: z
    .string()
    .refine((val) => Number(val) >= 1, {
      message: "Quantity must be at-least 1",
    })
    .refine((val) => Number(val) <= 999, {
      message: "Quantity is too large",
    }),
});

const formSchema = z.object({
  description: z
    .string()
    .max(128, { message: "Plan description must be less than 128 characters" })
    .optional(),
  items: z.array(planItemSchema),
  // .min(1, "At least one treatment is required"),
});

interface AddTreatmentPlanProps {
  trigger: React.ReactNode;
  patientId: string;
}

export default function AddTreatmentPlan({
  trigger,
  patientId,
}: AddTreatmentPlanProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent className="lg:max-w-3xl!">
        <DrawerHeader className="border-b flex-row w-full justify-between items-center">
          <DrawerTitle className="font-medium">Add Treatment Plan</DrawerTitle>
          <DrawerClose className="cursor-pointer" ref={closeRef}>
            <XIcon className="size-4" />
          </DrawerClose>
        </DrawerHeader>

        <AddTreatmentPlanForm
          patientId={patientId}
          onCancel={() => closeRef.current?.click()}
        />
      </DrawerContent>
    </Drawer>
  );
}

interface AddTreatmentPlanFormProps {
  onCancel?: () => void;
  patientId: string;
}

export function AddTreatmentPlanForm({
  onCancel,
  patientId,
}: AddTreatmentPlanFormProps) {
  const { data: treatmentTemplates } = useGetAllTreatmentTemplates({});
  const { mutateAsync: addTreatmentPlan } = useAddTreatmentPlan();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      items: [{ treatment_id: "", quantity: "1" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    await addTreatmentPlan({
      patientId,
      description: values.description,
      treatmentItems: values.items,
      onSuccess: () => {
        form.reset();
        onCancel?.();
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Description of the treatment plan"
                    className="resize-none h-28"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <h4>Plan Items</h4>

          {fields?.map((field, index) => (
            <div
              className="grid grid-cols-8 items-end gap-2 w-full"
              key={field?.id}
            >
              <div className="col-span-5 max-w-full overflow-hidden">
                <FormField
                  control={form.control}
                  name={`items.${index}.treatment_id`}
                  render={({ field }) => (
                    <FormItem className="col-span-4">
                      <FormLabel>Treatment</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value: string) => {
                            field.onChange(value);
                          }}
                          value={field?.value}
                        >
                          <SelectTrigger className="w-full bg-white">
                            <SelectValue placeholder="Select a treatment template" />
                          </SelectTrigger>

                          <SelectContent>
                            {(Array.isArray(treatmentTemplates)
                              ? treatmentTemplates
                              : []
                            ).map((template) => (
                              <SelectItem
                                value={template?.id}
                                key={template?.id}
                              >
                                <div
                                  className="size-4 rounded-sm"
                                  style={{ backgroundColor: template?.color }}
                                ></div>
                                {template?.name} - ₹ {template?.cost}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>

                      <FormControl>
                        <Input
                          type="number"
                          className="w-full bg-white"
                          placeholder="Qt."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-end gap-2 w-full">
                <Button
                  variant="destructive"
                  size="icon"
                  className="cursor-pointer"
                  disabled={fields?.length === 1}
                  onClick={() => remove(index)}
                >
                  <MinusIcon />
                </Button>

                <Button
                  size="icon"
                  className="cursor-pointer"
                  // disabled={fields?.length === 1}
                  onClick={() =>
                    append({
                      treatment_id: "",
                      quantity: "1",
                    })
                  }
                >
                  <PlusIcon />
                </Button>
              </div>
            </div>
          ))}

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
