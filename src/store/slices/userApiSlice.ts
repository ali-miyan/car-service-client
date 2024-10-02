import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUserUrl } from "../../constants/api";
import { HttpMethod } from "../../schema/httpMethods";

export const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUserUrl,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/get-users",
    }),
    getUserById: builder.query({
      query: (id: string) => `/get-user/${id}`,
    }),
    getCarById: builder.query({
      query: (id: string) => `/get-car/${id}`,
    }),
    getSelectedCar: builder.query({
      query: (id: string) => `/get-one-car/${id}`,
    }),
    getUserDashboard: builder.query({
      query: () => `/get-dashboard`,
    }),
    registerPost: builder.mutation({
      query: (postData) => ({
        url: "/register",
        method: HttpMethod.POST,
        body: postData,
      }),
    }),
    resendOtp: builder.mutation({
      query: (postData) => ({
        url: "/resend-otp",
        method: HttpMethod.POST,
        body: postData,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (postData) => ({
        url: "/verify-otp",
        method: HttpMethod.POST,
        body: postData,
      }),
    }),
    loginUser: builder.mutation({
      query: (postData) => ({
        url: "/login",
        method: HttpMethod.POST,
        body: postData,
      }),
    }),
    googleRegister: builder.mutation({
      query: (postData) => ({
        url: "/google-register",
        method: HttpMethod.POST,
        body: postData,
      }),
    }),
    resetRequest: builder.mutation({
      query: (postData) => ({
        url: "/reset-request",
        method: HttpMethod.POST,
        body: postData,
      }),
    }),
    resetPassword: builder.mutation({
      query: (postData) => ({
        url: "/change-password",
        method: HttpMethod.PATCH,
        body: postData,
      }),
    }),
    updateStatus: builder.mutation({
      query: ({ id, isBlocked }) => ({
        url: `/update-status/${id}`,
        method: HttpMethod.PATCH,
        body: { isBlocked },
      }),
    }),
    uploadImage: builder.mutation({
      query: (formData) => ({
        url: `/upload-image`,
        method: HttpMethod.POST,
        body: formData,
      }),
    }),
    editUser: builder.mutation({
      query: (formData) => ({
        url: `/edit-user`,
        method: HttpMethod.POST,
        body: formData,
      }),
    }),
    addCar: builder.mutation({
      query: (formData) => ({
        url: `/add-car`,
        method: HttpMethod.POST,
        body: formData,
      }),
    }),
    deleteCar: builder.mutation({
      query: (id: string) => ({
        url: `/delete-car/${id}`,
        method: HttpMethod.DELETE,
      }),
    }),
    changePassword: builder.mutation({
      query: (formData) => ({
        url: `/update-password`,
        method: HttpMethod.PATCH,
        body: formData,
      }),
    }),
    makeOrder: builder.mutation({
      query: (formData) => ({
        url: `/order`,
        method: HttpMethod.POST,
        body: formData,
      }),
    }),
    makeRating: builder.mutation({
      query: (formData) => ({
        url: `/add-rating`,
        method: HttpMethod.POST,
        body: formData,
      }),
    }),
  }),
});

export const {
  useRegisterPostMutation,
  useVerifyOtpMutation,
  useLoginUserMutation,
  useGoogleRegisterMutation,
  useResendOtpMutation,
  useResetRequestMutation,
  useResetPasswordMutation,
  useGetUsersQuery,
  useUpdateStatusMutation,
  useGetUserByIdQuery,
  useUploadImageMutation,
  useEditUserMutation,
  useAddCarMutation,
  useGetCarByIdQuery,
  useDeleteCarMutation,
  useChangePasswordMutation,
  useGetSelectedCarQuery,
  useMakeOrderMutation,
  useMakeRatingMutation,
  useGetUserDashboardQuery,
} = userApiSlice;
