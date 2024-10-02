import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseOrderUrl } from "../../constants/api";
import { HttpMethod } from "../../schema/httpMethods";

export const orderApiSlice = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseOrderUrl,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: (id: string) => `/get-bookings/${id}`,
    }),
    getSingleOrder: builder.query({
      query: (id: string) => `/get-single-order/${id}`,
    }),
    getUsersOrder: builder.query({
      query: (id: string) => `/get-users-order/${id}`,
    }),
    getLiveLocation: builder.query({
      query: (id: string) => `/get-live-location/${id}`,
    }),
    getMonthlyRevenue: builder.query({
      query: (id: string) => `/get-monthly-revenue/${id}`,
    }),
    makeOrder: builder.mutation({
      query: (formData) => ({
        url: `/booking`,
        method: HttpMethod.POST,
        body: formData,
      }),
    }),
    updateOrder: builder.mutation({
      query: (formData) => ({
        url: `/update-booking`,
        method: HttpMethod.POST,
        body: formData,
      }),
    }),
    updateStatus: builder.mutation({
      query: (formData) => ({
        url: `/update-booking-status`,
        method: HttpMethod.POST,
        body: formData,
      }),
    }),
    updateDriverLocation: builder.mutation({
      query: (formData) => ({
        url: `/update-driver-location`,
        method: HttpMethod.POST,
        body: formData,
      }),
    }),
    cancelBooking: builder.mutation({
      query: (formData) => ({
        url: `/cancel-booking`,
        method: HttpMethod.POST,
        body: formData,
      }),
    }),
    refundToUser: builder.mutation({
      query: (formData) => ({
        url: `/refund`,
        method: HttpMethod.POST,
        body: formData,
      }),
    }),
  }),
});

export const {
  useMakeOrderMutation,
  useUpdateOrderMutation,
  useGetOrdersQuery,
  useGetSingleOrderQuery,
  useUpdateStatusMutation,
  useGetUsersOrderQuery,
  useUpdateDriverLocationMutation,
  useGetLiveLocationQuery,
  useGetMonthlyRevenueQuery,
  useCancelBookingMutation,
  useRefundToUserMutation,
} = orderApiSlice;
