"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { XIcon } from "lucide-react";
import { useRef } from "react";

import { useIsMobile } from "@/hooks/use-mobile";
import { TreatmentPlanPayments } from "@/components/treatment-plans/TreatmentPlanDrawer";

interface AddPaymentTransactionProps {
  trigger: React.ReactNode;
  patientId: string;
}

export default function AddPaymentTransaction({
  trigger,
  patientId,
}: AddPaymentTransactionProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent className="max-w-full lg:max-w-3xl!">
        <DrawerHeader className="border-b flex-row w-full justify-between items-center">
          <DrawerTitle className="font-medium">
            Add Payment Transaction
          </DrawerTitle>
          <DrawerClose className="cursor-pointer" ref={closeRef}>
            <XIcon className="size-4" />
          </DrawerClose>
        </DrawerHeader>

        <TreatmentPlanPayments patientId={patientId} />
      </DrawerContent>
    </Drawer>
  );
}
