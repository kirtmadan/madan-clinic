import DescriptivePendingStats from "@/components/reports/DescriptivePendingStats";
import PendingPaymentsByPatients from "@/components/reports/PendingPaymentsByPatients";

export default function PendingReports() {
  return (
    <>
      <DescriptivePendingStats />
      <PendingPaymentsByPatients />
    </>
  );
}
