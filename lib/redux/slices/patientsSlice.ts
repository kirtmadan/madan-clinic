import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface PatientsState {
  patients: any[];
  isLoading: boolean;
}

const initialState: PatientsState = {
  patients: [],
  isLoading: false,
};

export const patientsSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    setPatients: (state, action: PayloadAction<any>) => {
      state.patients = action.payload;
    },
    setPatientsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setPatients, setPatientsLoading } = patientsSlice.actions;

export default patientsSlice.reducer;
