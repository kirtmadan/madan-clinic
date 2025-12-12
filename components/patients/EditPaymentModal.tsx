import type { ReactNode } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useUpdatePaymentRecord } from "@/lib/tanstack-query/treatment-plans/Mutations";

interface EditPaymentModalProps {
  id: string;
  amount: string;
  method: string;
  trigger: ReactNode;
}

export function EditPaymentModal({
  id,
  amount,
  method,
  trigger,
}: EditPaymentModalProps) {
  const { mutateAsync: updatePaymentRecord } = useUpdatePaymentRecord();

  const formSchema = z.object({
    amount: z
      .string()
      .min(1, { message: "Enter valid amount" })
      .refine((val) => Number(val) >= 0, {
        message: "Enter valid amount",
      })
      .refine((val) => Number(val) <= 999999, {
        message: "Received amount can not be more than 999999",
      }),
    method: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      method: method || "",
      amount,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updatePaymentRecord({
      id,
      amount: Number(values.amount),
      method: values.method,
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Edit Payment Details</DialogTitle>
          <DialogDescription>
            Make changes to the payment. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Received Amount</FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        className="w-full bg-white"
                        placeholder="Received amount"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Received Amount</FormLabel>

                    <FormControl>
                      <Select
                        onValueChange={(value: string) => {
                          field.onChange(value);
                        }}
                        value={field?.value}
                      >
                        <SelectTrigger
                          className={cn(
                            "w-full bg-white capitalize cursor-pointer",
                          )}
                        >
                          <SelectValue placeholder="Select a treatment template" />
                        </SelectTrigger>

                        <SelectContent>
                          {["cash", "online"].map((m) => (
                            <SelectItem
                              value={m}
                              key={m}
                              className="capitalize"
                            >
                              {m}
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

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
