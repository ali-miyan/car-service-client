import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseCompanyUrl } from "../../constants/api";
import { HttpMethod } from "../../schema/httpMethods";
import { getQueryParams } from "../../helpers/queries";

export const companyApiSlice = createApi({
  reducerPath: "companyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseCompanyUrl,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getCompanies: builder.query({
      query: () => "/get-approvals",
      keepUnusedDataFor: 300,
    }),
    getServices: builder.query({
      query: (id: string) => `/get-services/${id}`,
      keepUnusedDataFor: 300,
    }),
    getDashboard: builder.query({
      query: () => `/get-dashboard`,
      keepUnusedDataFor: 300,
    }),
    getEveryServices: builder.query({
      query: () => {
        const { sort, search, price, company, service, page } =
          getQueryParams();
        const queryParams = [];

        if (sort) queryParams.push(`sort=${encodeURIComponent(sort)}`);
        if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
        if (price) queryParams.push(`price=${encodeURIComponent(price)}`);
        if (company) queryParams.push(`company=${encodeURIComponent(company)}`);
        if (service) queryParams.push(`service=${encodeURIComponent(service)}`);
        if (page) queryParams.push(`page=${encodeURIComponent(page)}`);

        const queryString =
          queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

        return `/get-all-services${queryString}`;
      },
    }),
    getSinglServices: builder.query({
      query: (id: string) => `/get-single-service/${id}`,
      keepUnusedDataFor: 300,
    }),
    getRatings: builder.query({
      query: (id: string) => `/get-ratings/${id}`,
      keepUnusedDataFor: 300,
    }),

    getCompanyById: builder.query({
      query: (id: string) => `/get-company/${id}`,
    }),
    getApprovedCompany: builder.query({
      query: () => `/get-approved-company`,
    }),
    updateCompany: builder.mutation({
      query: ({ id, isBlocked, isApproved }) => {
        const body: any = {};
        if (isBlocked !== undefined) body.isBlocked = isBlocked;
        if (isApproved !== undefined) body.isApproved = isApproved;
        return {
          url: `/company-status/${id}`,
          method: HttpMethod.PATCH,
          body,
        };
      },
    }),
    updateServiceStatus: builder.mutation({
      query: ({ id, isBlocked }) => ({
        url: `/services-status/${id}`,
        method: HttpMethod.PATCH,
        body: { isBlocked },
      }),
    }),
    registerPost: builder.mutation({
      query: (postData) => ({
        url: "/register",
        method: HttpMethod.POST,
        body: postData,
      }),
    }),
    loginPost: builder.mutation({
      query: (postData) => ({
        url: "/login",
        method: HttpMethod.POST,
        body: postData,
      }),
    }),
    addService: builder.mutation({
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
    updateRating: builder.mutation({
      query: (data) => ({
        url: `/update-rating`,
        method: HttpMethod.POST,
        body: data,
      }),
    }),
  }),
});

export const {
  useRegisterPostMutation,
  useLoginPostMutation,
  useGetCompaniesQuery,
  useUpdateCompanyMutation,
  useGetCompanyByIdQuery,
  useAddServiceMutation,
  useGetServicesQuery,
  useUpdateServiceStatusMutation,
  useDeleteServicePostMutation,
  useGetEveryServicesQuery,
  useGetApprovedCompanyQuery,
  useGetSinglServicesQuery,
  useGetRatingsQuery,
  useUpdateRatingMutation,
  useGetDashboardQuery,
} = companyApiSlice;
