import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/lib/redux/slices/authSlice";
import patientsReducer from "@/lib/redux/slices/patientsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientsReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
