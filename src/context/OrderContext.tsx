import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    userId: "",
    serviceId: "",
    servicePlace: "",
    companyId: "",
    selectedPlace: "",
    serviceDate: "",
    date: "",
    address: {},
    carModel: "",
    selectedPackage: "",
    generalServiceId: "",
  },
  reducers: {
    setServiceId(state, action) {
      state.serviceId = action.payload;
    },
    setUserId(state, action) {
      state.userId = action.payload;
    },
    setCompanyId(state, action) {
      state.companyId = action.payload;
    },
    setServicePlace(state, action) {
      state.servicePlace = action.payload;
    },
    SetSelectedPlace(state, action) {
      state.selectedPlace = action.payload;
    },
    setServiceDate(state, action) {
      state.serviceDate = action.payload;
    },
    setDate(state, action) {
      state.date = action.payload;
    },
    setAddress(state, action) {
      state.address = action.payload;
    },
    setCarModel(state, action) {
      state.carModel = action.payload;
    },
    setPackage(state, action) {
      state.selectedPackage = action.payload;
    },
    setGeneralService(state, action) {
      state.generalServiceId = action.payload;
    },
    resetOrder() {
      return {
        userId: "",
        serviceId: "",
        servicePlace: "",
        companyId: "",
        selectedPlace: "",
        serviceDate: "",
        date: "",
        address: {},
        carModel: "",
        selectedPackage: "",
        generalServiceId: "",
      };
    },
  },
});

export const {
  setUserId,
  setServiceId,
  setServicePlace,
  setCompanyId,
  SetSelectedPlace,
  setServiceDate,
  setDate,
  setAddress,
  setCarModel,
  setPackage,
  resetOrder,
  setGeneralService,
} = orderSlice.actions;

export default orderSlice.reducer;
