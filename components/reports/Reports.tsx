import TimeSelector from "@/components/reports/TimeSelector";
import DescriptiveStatCards from "@/components/reports/DescriptiveStat";
import PaymentsByPatients from "@/components/reports/PaymentsByPatients";

export default function Reports() {
  return (
    <>
      <TimeSelector />

      <DescriptiveStatCards />
      <PaymentsByPatients />
    </>
  );
}
