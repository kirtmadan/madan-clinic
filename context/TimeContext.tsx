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

interface TimeContextType {
  timeState: CustomDateRange;
  setTimeState: Dispatch<SetStateAction<CustomDateRange>>;
}

const TimeContext = createContext<TimeContextType | undefined>(undefined);

const TimeContextProvider = ({ children }: { children: ReactNode }) => {
  const [timeState, setTimeState] = useState<CustomDateRange>({
    value: "custom",
    from: new Date(),
    to: new Date(),
  });

  return (
    <TimeContext.Provider
      value={{
        timeState,
        setTimeState,
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
