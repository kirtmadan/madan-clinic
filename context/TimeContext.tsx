"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { type DateRange } from "react-day-picker";

export interface CustomDateRange extends DateRange {
  value: string;
}

interface ReportsData {
  totalPayments: number;
  totalCompletedAppointments: number;
}

interface TimeContextType {
  paymentType: string;
  setPaymentType: Dispatch<SetStateAction<string>>;

  timeState: CustomDateRange;
  setTimeState: Dispatch<SetStateAction<CustomDateRange>>;

  reportsData: ReportsData;
  setReportsData: Dispatch<SetStateAction<ReportsData>>;
}

const TimeContext = createContext<TimeContextType | undefined>(undefined);

const TimeContextProvider = ({ children }: { children: ReactNode }) => {
  const [timeState, setTimeState] = useState<CustomDateRange>({
    value: "custom",
    from: new Date(),
    to: new Date(),
  });

  const [reportsData, setReportsData] = useState<ReportsData>({
    totalPayments: 0,
    totalCompletedAppointments: 0,
  });

  const [paymentType, setPaymentType] = useState<string>("online");

  return (
    <TimeContext.Provider
      value={{
        timeState,
        setTimeState,
        paymentType,
        setPaymentType,

        reportsData,
        setReportsData,
      }}
    >
      {children}
    </TimeContext.Provider>
  );
};

const useTime = () => {
  const context = useContext(TimeContext);

  if (!context) {
    throw Error("TimeContextProvider is not applied");
  }

  return context;
};

export { useTime, TimeContextProvider };
