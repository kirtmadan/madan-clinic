import TimeSelector from "@/components/reports/TimeSelector";
import DescriptiveStatCards from "@/components/reports/DescriptiveStat";
import { ChartAreaInteractive } from "@/components/reports/ChartAreaInteractive";

export default function Reports() {
  return (
    <>
      <TimeSelector />

      <DescriptiveStatCards />
      <ChartAreaInteractive />
    </>
  );
}
