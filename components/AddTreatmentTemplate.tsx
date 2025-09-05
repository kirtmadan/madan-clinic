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
import { Input, InputWithIcon } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IndianRupeeIcon } from "lucide-react";
import { useEffect, useRef } from "react";

import { Textarea } from "@/components/ui/textarea";
import {
  useAddTreatmentTemplate,
  useUpdateTreatmentTemplate,
} from "@/lib/tanstack-query/treatment-templates/Mutations";

import { Sketch } from "@uiw/react-color";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Treatment name is required" })
    .max(48, { message: "Treatment name must be less than 48 characters" }),
  description: z
    .string()
    .max(128, { message: "Description must be less than 128 characters" }),
  color: z.string().min(1, { message: "Treatment color is required" }),
  cost: z
    .string()
    .min(1, {
      message: "Cost is a required field",
    })
    .refine((val) => !isNaN(Number(val)), {
      message: "Please enter a valid amount",
    }),
  total_sessions: z
    .string()
    .min(1, { message: "Enter the total number of sessions" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Please enter a valid number",
    }),
  minutes_per_session: z
    .string()
    .min(1, { message: "Enter the minutes per session" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Please enter a valid number",
    }),
  active: z.boolean(),
});

interface AddTreatmentTemplateProps {
  trigger: React.ReactNode;
  editData?: any;
}

export default function AddTreatmentTemplate({
  trigger,
  editData,
}: AddTreatmentTemplateProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="h-[85vh] max-w-full xl:max-w-4xl overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="font-medium">
            Add Treatment Template
          </DialogTitle>
        </DialogHeader>

        <AddTreatmentTemplateForm
          editData={editData}
          onCancel={() => closeRef.current?.click()}
        />
      </DialogContent>
    </Dialog>
  );
}

interface AddTreatmentTemplateFormProps {
  onCancel?: () => void;
  editData?: any;
}

export function AddTreatmentTemplateForm({
  onCancel,
  editData,
}: AddTreatmentTemplateFormProps) {
  const { mutateAsync: addTreatmentTemplate } = useAddTreatmentTemplate();
  const { mutateAsync: updateTreatmentTemplate } = useUpdateTreatmentTemplate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      cost: "",
      color: "",
      total_sessions: "",
      minutes_per_session: "",
      active: true,
    },
  });

  useEffect(() => {
    if (editData) {
      form.reset({
        name: editData?.name,
        description: editData?.description,
        cost: editData?.cost?.toString(),
        color: editData?.color,
        total_sessions: editData?.total_sessions?.toString(),
        minutes_per_session: editData?.minutes_per_session?.toString(),
        active: Boolean(editData?.active),
      });
    }
  }, [editData, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (editData) {
      return await updateTreatmentTemplate({
        doc: {
          ...values,
          cost: Number(values.cost),
          total_sessions: Number(values.total_sessions),
          minutes_per_session: Number(values.minutes_per_session),
        },
        documentId: editData?.id,
        onSuccess: () => {
          onCancel?.();
          form.reset();
        },
      });
    }

    await addTreatmentTemplate({
      doc: {
        ...values,
        cost: Number(values.cost),
        total_sessions: Number(values.total_sessions),
        minutes_per_session: Number(values.minutes_per_session),
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
          className="space-y-8 px-4 pb-4 w-full overflow-y-auto"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Treatment Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name of the treatment" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Treatment Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the description of the treatment"
                    className="min-h-32 resize-none"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Treatment Color</FormLabel>
                <FormControl>
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-fit pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            <>
                              <div
                                className="size-5 rounded-sm"
                                style={{
                                  backgroundColor: field.value,
                                }}
                              ></div>
                              {field.value}
                            </>
                          ) : (
                            "Select a color for the template"
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0" align="start">
                      <Sketch
                        color={field.value}
                        onChange={(color: { hex: string }) => {
                          field.onChange(color.hex);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost</FormLabel>
                <FormControl>
                  <InputWithIcon
                    type="number"
                    placeholder="Enter the cost of the treatment in Rs."
                    StartIcon={
                      <IndianRupeeIcon
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
            name="total_sessions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total sessions</FormLabel>
                <FormControl>
                  <InputWithIcon
                    placeholder="Number of session required for the treatment"
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
            name="minutes_per_session"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minutes per session</FormLabel>
                <FormControl>
                  <InputWithIcon
                    placeholder="How many minutes does each session take?"
                    type="number"
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
