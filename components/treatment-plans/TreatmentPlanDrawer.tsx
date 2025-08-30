import { useMemo, useRef } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  CheckCircle2Icon,
  IndianRupeeIcon,
  MinusIcon,
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
  useUpdateTreatmentPlanItems,
  useUpdateTreatmentPlanPayment,
} from "@/lib/tanstack-query/treatment-plans/Mutations";
import { isEqual } from "lodash";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TreatmentPlanDrawerProps {
  trigger: React.ReactNode;
  planData: any;
}

export default function TreatmentPlanDrawer({
  trigger,
  planData,
}: TreatmentPlanDrawerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const totalAmountToBeCharged = useMemo(() => {
    return (
      planData?.treatment_plan_items?.reduce(
        (sum: number, item: any) =>
          sum + item?.quantity * item?.recorded_unit_price,
        0,
      ) || 0
    );
  }, [planData]);

  return (
    <Drawer direction="right">
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
                  <span>Authorized amount</span>
                  {planData?.authorized_amount === totalAmountToBeCharged ||
                  !planData?.authorized_amount ? (
                    <span className="text-muted-foreground">
                      ₹ {totalAmountToBeCharged}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      <span className="line-through mr-2">
                        {totalAmountToBeCharged}
                      </span>
                      ₹{planData?.authorized_amount}
                    </span>
                  )}
                </div>
              </div>

              <TreatmentPlanDescription description={planData?.description} />

              <hr className="my-4" />

              <h4>Plan Items</h4>

              <TreatmentPlanItems treatment_plan_id={planData?.id} />
            </div>
          </TabsContent>
          <TabsContent value="payment">
            <div className="flex flex-col gap-4 p-4 w-full">
              <h4>Total paid amount : ₹ {planData?.paid_total || 0}</h4>
              {planData?.status === "paid" ? (
                <TreatmentPaid />
              ) : (
                <TreatmentPlanPayments
                  totalAmountToBeCharged={totalAmountToBeCharged}
                  totalPaidAmount={planData?.paid_total}
                  treatmentPlanId={planData?.id}
                  authorized_amount={planData?.authorized_amount}
                />
              )}
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
    .refine((val) => Number(val) >= 1, {
      message: "Quantity must be at-least 1",
    })
    .refine((val) => Number(val) <= 999, {
      message: "Quantity is too large",
    }),
  plan_item_id: z.string().optional(),
});

function TreatmentPlanItems({
  treatment_plan_id,
}: {
  treatment_plan_id: string;
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

          <div className="flex items-center gap-2 justify-end w-full">
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

function TreatmentPlanPayments({
  totalAmountToBeCharged,
  totalPaidAmount,
  treatmentPlanId,
  authorized_amount,
}: {
  totalAmountToBeCharged: number;
  totalPaidAmount: number;
  treatmentPlanId: string;
  authorized_amount: number;
}) {
  const { mutateAsync: updateTreatmentPlanPayment, isPending } =
    useUpdateTreatmentPlanPayment();

  const formSchema = z.object({
    authorized_amount: z
      .string()
      .min(1, { message: "Enter valid amount" })
      .refine((val) => Number(val) >= 0, {
        message: "Enter valid amount",
      })
      .refine((val) => Number(val) <= totalAmountToBeCharged, {
        message: "Authorized amount can not be more than total amount",
      }),
    amount: z
      .string()
      .min(1, { message: "Enter valid amount" })
      .refine((val) => Number(val) >= 0, {
        message: "Enter valid amount",
      })
      .refine(
        (val) => Number(val) <= totalAmountToBeCharged - (totalPaidAmount || 0),
        {
          message: "Received amount can not be more than total amount",
        },
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      authorized_amount:
        authorized_amount?.toString() ||
        totalAmountToBeCharged?.toString() ||
        "",
      amount: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values);

    await updateTreatmentPlanPayment({
      amount: Number(values.amount),
      auth_amount: Number(values.authorized_amount),
      treatmentPlanId,
    });
  }

  return (
    <div className="w-full h-full border p-4 border-dashed flex flex-col gap-4 rounded-lg">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4"
        >
          <FormField
            control={form.control}
            name="authorized_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Authorized Amount</FormLabel>

                <FormControl>
                  <Input
                    type="number"
                    className="w-full bg-white"
                    placeholder="Authorized amount"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

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

          <div className="col-span-2 flex items-center justify-end gap-2 w-full">
            <Button type="submit" loading={isPending}>
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function TreatmentPaid() {
  return (
    <Alert className="text-green-700 border-green-200 bg-green-100">
      <CheckCircle2Icon />
      <AlertTitle>Plan Paid in Full!</AlertTitle>
      <AlertDescription className="text-green-700">
        The authorized amount for this treatment plan has been received. The
        plan is now marked as paid.
      </AlertDescription>
    </Alert>
  );
}
