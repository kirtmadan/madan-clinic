import { useMemo, useRef, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DownloadIcon,
  IndianRupeeIcon,
  MinusIcon,
  PencilIcon,
  PlusIcon,
  Rows4Icon,
  XIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dayjs from "dayjs";
import AppointmentStatusRenderer from "@/components/cellRenderers/AppointmentStatusRenderer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetAllTreatmentTemplates } from "@/lib/tanstack-query/treatment-templates/Queries";
import { useGetAllTreatmentPlanItems } from "@/lib/tanstack-query/treatment-plans/Queries";
import { Progress } from "@/components/ui/progress";
import {
  useUpdateTreatmentPlan,
  useUpdateTreatmentPlanItems,
  useUpdateTreatmentPlanPayment,
} from "@/lib/tanstack-query/treatment-plans/Mutations";
import { isEqual } from "lodash";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { getData } from "@/lib/actions/supabase.actions";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { generateInvoice } from "@/lib/actions/invoice.actions";

interface TreatmentPlanDrawerProps {
  trigger: React.ReactNode;
  planData: any;
}

export default function TreatmentPlanDrawer({
  trigger,
  planData,
}: TreatmentPlanDrawerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const isMobile = useIsMobile();

  const [editAuthAmount, setEditAuthAmount] = useState<boolean>(false);

  const { mutateAsync: updateTreatmentPlan } = useUpdateTreatmentPlan();

  const totalAmountToBeCharged = useMemo(() => {
    return (
      planData?.treatment_plan_items?.reduce(
        (sum: number, item: any) =>
          sum + item?.quantity * item?.recorded_unit_price,
        0,
      ) || 0
    );
  }, [planData]);

  const updateAuthAmount = async (amount: number) => {
    try {
      await updateTreatmentPlan({
        documentId: planData?.id,
        doc: {
          authorized_amount: amount,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setEditAuthAmount(false);
    }
  };

  function adjustLineItems(
    lineItems: { unit_cost: number; name: string; quantity: number }[],
    targetTotal: number,
  ) {
    // Calculate current total
    const currentTotal = lineItems.reduce(
      (sum, item) => sum + item.unit_cost,
      0,
    );

    if (currentTotal === 0) {
      // Avoid division by zero
      const equalAmount = targetTotal / lineItems?.length;
      return lineItems.map((item) => ({ ...item, unit_cost: equalAmount }));
    }

    // Calculate adjustment ratio
    const ratio = targetTotal / currentTotal;

    // Apply the ratio to each item
    return lineItems.map((item) => ({
      ...item,
      unit_cost: parseFloat((item.unit_cost * ratio).toFixed(2)), // round to 2 decimals
    }));
  }

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent className="sm:w-[800px]! sm:max-w-none! overflow-x-hidden overflow-y-auto">
        <DrawerHeader className="border-b flex-col w-full gap-3">
          <div className="flex flex-row w-full justify-between items-center">
            <DrawerTitle className="font-medium"># {planData?.id}</DrawerTitle>
            <DrawerClose className="cursor-pointer" ref={closeRef}>
              <XIcon className="size-4" />
            </DrawerClose>
          </div>

          <div className="w-full h-full">
            <span>Status : </span>
            <AppointmentStatusRenderer status={planData?.status} />
          </div>
        </DrawerHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full p-0 bg-background justify-start border-b rounded-none">
            <TabsTrigger
              value="details"
              className="rounded-none bg-background h-full data-[state=active]:shadow-none border-0 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary"
            >
              <Rows4Icon />
              Plan Details
            </TabsTrigger>
            <TabsTrigger
              value="payment"
              className="rounded-none bg-background h-full data-[state=active]:shadow-none border-0 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary"
            >
              <IndianRupeeIcon />
              Payments
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <div className="flex flex-col gap-4 p-4 w-full">
              <div className="flex flex-row gap-4 w-full">
                <div className="border border-dashed p-3 rounded-lg text-sm w-full h-full flex flex-col gap-1">
                  <span>Plan created at</span>
                  <span className="text-muted-foreground">
                    {dayjs(planData?.created_at).format("DD MMM YYYY")}
                  </span>
                </div>

                <div className="border border-dashed p-3 rounded-lg text-sm w-full h-full flex flex-col gap-1">
                  <span>Plan updated at</span>
                  <span className="text-muted-foreground">
                    {dayjs(planData?.updated_at || planData?.created_at).format(
                      "DD MMM YYYY",
                    )}
                  </span>
                </div>

                <div className="border border-dashed p-3 rounded-lg text-sm w-full h-full flex flex-col gap-1">
                  <span className="inline-flex gap-2 items-center justify-between">
                    Authorized Amount
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <PencilIcon
                          size={16}
                          className="cursor-pointer"
                          onClick={() => setEditAuthAmount(true)}
                        />
                      </TooltipTrigger>

                      <TooltipContent>
                        <p>Edit authorized amount</p>
                      </TooltipContent>
                    </Tooltip>
                  </span>

                  {/*<span className="text-muted-foreground">*/}
                  {/*  ₹ {totalAmountToBeCharged}*/}
                  {/*</span>*/}

                  {planData?.authorized_amount === totalAmountToBeCharged ||
                  !planData?.authorized_amount ? (
                    <>
                      {editAuthAmount ? (
                        <Input
                          className="w-full"
                          type="number"
                          defaultValue={totalAmountToBeCharged}
                          onBlur={async (e) => {
                            if (e.target.value) {
                              await updateAuthAmount(Number(e.target.value));
                            }
                          }}
                          onKeyDown={async (e) => {
                            if (e.key === "Enter" && e.currentTarget.value) {
                              await updateAuthAmount(
                                Number(e.currentTarget.value),
                              );
                            }
                          }}
                        />
                      ) : (
                        <span className="text-muted-foreground">
                          ₹ {totalAmountToBeCharged}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      {editAuthAmount ? (
                        <Input
                          className="w-full"
                          type="number"
                          defaultValue={planData?.authorized_amount}
                          onBlur={async (e) => {
                            if (e.target.value) {
                              await updateAuthAmount(Number(e.target.value));
                            }
                          }}
                          onKeyDown={async (e) => {
                            if (e.key === "Enter" && e.currentTarget.value) {
                              await updateAuthAmount(
                                Number(e.currentTarget.value),
                              );
                            }
                          }}
                        />
                      ) : (
                        <span className="text-muted-foreground">
                          <span className="line-through mr-2">
                            {totalAmountToBeCharged}
                          </span>
                          ₹{planData?.authorized_amount}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              <TreatmentPlanDescription description={planData?.description} />

              <hr className="my-4" />

              <h4>Plan Items</h4>

              <TreatmentPlanItems
                disableEditing={false}
                // disableEditing={["partially_paid", "paid"].includes(
                //   planData?.status,
                // )}
                treatment_plan_id={planData?.id}
              />
            </div>
          </TabsContent>

          <TabsContent value="payment">
            <div className="flex flex-col gap-4 p-4 w-full">
              <div className="flex items-center justify-end gap-4 w-full">
                <Button
                  onClick={async () => {
                    const items = planData?.treatment_plan_items?.map(
                      (item: any) => ({
                        name: item?.t?.name,
                        quantity: item?.quantity,
                        unit_cost: item?.recorded_unit_price,
                      }),
                    );

                    await generateInvoice({
                      from:
                        "Dr Madan’s Dental Clinic \n" +
                        "Near One Pathology\n" +
                        "Rampath, Khawaspura\n" +
                        "Faizabad-Ayodhya\n" +
                        "9566332912",
                      to: planData?.patient?.name,
                      items:
                        planData?.authorized_amount > totalAmountToBeCharged
                          ? adjustLineItems(items, planData?.authorized_amount)
                          : items,
                      discounts:
                        totalAmountToBeCharged -
                        (planData?.authorized_amount || 0),
                      amount_paid: planData?.paid_total,
                      fields:
                        planData?.authorized_amount &&
                        totalAmountToBeCharged > planData?.authorized_amount
                          ? {
                              discounts: true,
                            }
                          : undefined,
                      notes: "Dr. Kirt Madan\n" + "REG NO - 12365",
                      notes_title: " ",
                    });
                  }}
                >
                  <DownloadIcon /> Download Invoice
                </Button>
              </div>

              {/*<h4>Total paid amount : ₹ {planData?.paid_total || 0}</h4>*/}
              {/*// {planData?.status === "paid" ? (*/}
              {/*//   <TreatmentPaid />*/}
              {/*// ) : (*/}
              <TreatmentPlanPayments
                // totalPaidAmount={planData?.paid_total}
                // treatmentPlanId={planData?.id}
                // authorized_amount={planData?.authorized_amount}
                patientId={planData?.patient?.id}
              />
              {/*)}*/}
            </div>
          </TabsContent>
        </Tabs>
      </DrawerContent>
    </Drawer>
  );
}

function TreatmentPlanDescription({ description }: { description: string }) {
  return (
    <div className="w-full h-full border p-4 border-dashed flex flex-col gap-4 rounded-lg">
      <h3 className="font-medium">Treatment Plan Description</h3>

      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

const planItemSchema = z.object({
  treatment_id: z.string().min(1, { message: "Select a treatment" }),
  quantity: z
    .string()
    .refine((val) => Number(val) >= 0, {
      message: "Quantity must be at-least 0",
    })
    .refine((val) => Number(val) <= 999, {
      message: "Quantity is too large",
    }),
  plan_item_id: z.string().optional(),
});

function TreatmentPlanItems({
  treatment_plan_id,
  disableEditing,
}: {
  treatment_plan_id: string;
  disableEditing: boolean;
}) {
  const formSchema = z.object({
    items: z.array(planItemSchema),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: [{ treatment_id: "", quantity: "1" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = form.watch("items");
  const plainWatchedItems = JSON.parse(JSON.stringify(watchedItems));

  const { data: treatmentTemplates } = useGetAllTreatmentTemplates({});

  const { data: planItems, isFetching } = useGetAllTreatmentPlanItems({
    queryKeys: [treatment_plan_id],
    filters: [(query: any) => query.eq("treatment_plan_id", treatment_plan_id)],
    select: `plan_item_id:id, quantity::text, treatment_id`,
    onSuccess: (res) => {
      form.setValue("items", res);
    },
  });

  const arePlanItemsSame = useMemo(() => {
    const normalize = (arr: any[]) =>
      arr?.map(({ treatment_id, quantity, plan_item_id }) => ({
        treatment_id,
        quantity: String(quantity), // normalize type
        plan_item_id: plan_item_id ?? null,
      })) ?? [];

    return isEqual(planItems, normalize(plainWatchedItems));
  }, [plainWatchedItems, planItems]);

  const { mutateAsync: updatePlanItems, isPending } =
    useUpdateTreatmentPlanItems();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (disableEditing) return;
    if (arePlanItemsSame) return;

    await updatePlanItems({
      treatmentPlanId: treatment_plan_id,
      treatmentItems: values.items,
    });
  }

  if (isFetching) {
    return (
      <div className="w-full h-full border p-4 border-dashed flex flex-col gap-4 rounded-lg animate-pulse">
        <p className="text-sm">Loading...</p>
        <Progress className="w-full h-2.5 rounded-xs!" indeterminate />
      </div>
    );
  }

  return (
    <div className="w-full h-full border p-4 border-dashed flex flex-col gap-4 rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                          <SelectTrigger
                            className={cn(
                              "w-full bg-white",
                              disableEditing && "pointer-events-none",
                            )}
                          >
                            <SelectValue placeholder="Select a treatment template" />
                          </SelectTrigger>

                          <SelectContent>
                            {(Array.isArray(treatmentTemplates)
                              ? treatmentTemplates
                              : []
                            )
                              ?.sort((a, b) =>
                                a?.name
                                  ?.trim()
                                  ?.toLowerCase()
                                  ?.localeCompare(
                                    b?.name?.trim()?.toLowerCase(),
                                  ),
                              )
                              .map((template) => (
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
                          readOnly={disableEditing}
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

              <div
                className={cn(
                  "flex items-center justify-end gap-2 w-full",
                  disableEditing && "hidden",
                )}
              >
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

          <div
            className={cn(
              "flex items-center gap-2 justify-end w-full",
              disableEditing && "hidden",
            )}
          >
            <Button
              type="submit"
              loading={isPending}
              disabled={arePlanItemsSame}
            >
              Update plan items
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export function TreatmentPlanPayments({ patientId }: { patientId: string }) {
  const { data: totalAmountToBeCharged } = useQuery({
    queryKey: ["patientsOverdueAmount", patientId],
    queryFn: async () => {
      const data = await getData({
        tableName: "patient_overdue_summary",
        documentId: patientId,
        select: `*`,
        comparisonKey: "patient_id",
      });

      return data?.outstanding ?? data?.authorized_total ?? 0;
    },
    enabled: !!patientId,
  });

  const { mutateAsync: updateTreatmentPlanPayment, isPending } =
    useUpdateTreatmentPlanPayment();

  const formSchema = useMemo(() => {
    return z.object({
      amount: z
        .string()
        .min(1, { message: "Enter valid amount" })
        .refine((val) => Number(val) >= 0, {
          message: "Enter valid amount",
        })
        .refine((val) => Number(val) <= totalAmountToBeCharged, {
          message: "Received amount can not be more than total amount",
        }),
      method: z.string(),
    });
  }, [totalAmountToBeCharged]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      method: "cash",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values);

    await updateTreatmentPlanPayment({
      amount: Number(values.amount),
      method: values.method,
      patientId,
      onSuccess: () => {
        form.reset({
          amount: "",
          method: "cash",
        });
      },
    });
  }

  return (
    <div className="w-full h-full border p-4 border-dashed flex flex-col gap-4 rounded-lg">
      <p className="border-b border-dashed pb-2">
        Total overdue of patient : {totalAmountToBeCharged}
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4"
        >
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
                    <SelectTrigger className={cn("w-full bg-white capitalize")}>
                      <SelectValue placeholder="Select a treatment template" />
                    </SelectTrigger>

                    <SelectContent>
                      {["cash", "online"].map((m) => (
                        <SelectItem value={m} key={m} className="capitalize">
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

          <div className="col-span-2 flex items-center justify-end gap-2 w-full">
            <Button
              type="submit"
              loading={isPending}
              disabled={!totalAmountToBeCharged}
            >
              Add transaction
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

// function TreatmentPaid() {
//   return (
//     <Alert className="text-green-700 border-green-200 bg-green-100">
//       <CheckCircle2Icon />
//       <AlertTitle>Plan Paid in Full!</AlertTitle>
//       <AlertDescription className="text-green-700">
//         The authorized amount for this treatment plan has been received. The
//         plan is now marked as paid.
//       </AlertDescription>
//     </Alert>
//   );
// }
