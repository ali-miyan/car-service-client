import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseChatUrl } from "../../constants/api";

export const chatApiSlice = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseChatUrl,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getChat: builder.query({
      query: ({ userId, companyId }) => `/get-chat/${userId}/${companyId}`,
    }),
    getCompanyChat: builder.query({
      query: (companyId) => `/get-company-chat/${companyId}`,
    }),
    getBookedUsers: builder.query({
      query: (companyId) => `/get-booked-users/${companyId}`,
    }),
  }),
});

export const {
  useGetChatQuery,
  useGetCompanyChatQuery,
  useGetBookedUsersQuery,
} = chatApiSlice;
