import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseAdminUrl } from "../../constants/api";
import { HttpMethod } from "../../schema/httpMethods";

export const adminApiSlice = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseAdminUrl,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getService: builder.query({
      query: (id?) => (id ? `/get-service?companyId=${id}` : `/get-service`),
      keepUnusedDataFor: 300,
    }),
    registerPost: builder.mutation({
      query: (postData) => ({
        url: "/login",
        method: HttpMethod.POST,
        body: postData,
      }),
    }),
    addServicePost: builder.mutation({
      query: (postData) => ({
        url: "/add-service",
        method: HttpMethod.POST,
        body: postData,
      }),
    }),
    deleteServicePost: builder.mutation({
      query: (id: string) => ({
        url: `/delete-service/${id}`,
        method: HttpMethod.DELETE,
      }),
    }),
    updateServiceStatus: builder.mutation({
      query: ({ id, isBlocked }) => ({
        url: `/services-status/${id}`,
        method: HttpMethod.PATCH,
        body: { isBlocked },
      }),
    }),
  }),
});

export const {
  useGetServiceQuery,
  useRegisterPostMutation,
  useAddServicePostMutation,
  useDeleteServicePostMutation,
  useUpdateServiceStatusMutation,
} = adminApiSlice;
