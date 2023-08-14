import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  reducerPath: "adminApi",
  tagTypes: [
    "User",
    "Products",
    "Customers",
    "Transactions",
    "Geography",
    "Sales",
    "Admins",
    "Performance",
    "Dashboard",
  ],
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `general/user/${id}`,
      providesTags: ["User"],
    }),
    getProducts: build.query({
      query: () => `client/products/`,
      providesTags: ["Products"],
    }),
    getCustomers: build.query({
      query: () => "client/customers/",
      providesTags: ["Customers"],
    }),
    getTransactions: build.query({
      query: ({ pagination, sort, search }) => ({
        url: "client/transactions/",
        method: "GET",
        params: { pagination, sort, search },
      }),
      providesTags: ["Transactions"],
    }),
    getGeography: build.query({
      query: () => "/client/geography/",
      providesTags: ["Geography"],
    }),
    getSales: build.query({
      query: () => "/sales/sales/",
      providesTags: ["Sales"],
    }),
    getAdmins: build.query({
      query: ({ role, status }) => ({
        url: "/management/admins/",
        method: "GET",
        params: { role, status },
      }),
      providesTags: ["Admins"],
    }),
    updateAdmin: build.mutation({
      query: ({ id, user }) => ({
        url: "/management/admins/",
        method: "PUT",
        body: { id, user },
      }),
      invalidatesTags: ["Admins"],
    }),
    editAdminStatus: build.mutation({
      query: ({
        ticketId,
        userId,
        adminId,
        ticketStatus,
        doc,
        type,
        endDate,
        status,
        startDate,
      }) => ({
        url: "/management/admins/status",
        method: "PUT",
        body: {
          startDate,
          ticketId,
          userId,
          adminId,
          ticketStatus,
          doc,
          type,
          endDate,
          status,
        },
      }),
      invalidatesTags: ["Admins"],
    }),
    editAdminRole: build.mutation({
      query: ({ id, role }) => ({
        url: "/management/admins/addbyuser/",
        method: "PUT",
        body: { id, role },
      }),
      invalidatesTags: ["Admins"],
    }),
    addAdmin: build.mutation({
      query(body) {
        return {
          url: `/management/admins/addmanualy/`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Admins"],
    }),
    getAllTickets: build.query({
      query: ({ role, status }) => ({
        url: "/management/admins/tickets",
        method: "GET",
        params: { role, status },
      }),
      providesTags: ["Admins"],
    }),
    getTicket: build.query({
      query: ({ role, id }) => ({
        url: "/management/admins/ticket",
        method: "GET",
        params: { role, id },
      }),
      providesTags: ["Admins"],
    }),

    editTicketStatus: build.mutation({
      query: ({ role, id, status }) => ({
        url: "/management/admins/ticket",
        method: "PUT",
        body: { role, id, status },
      }),
      invalidatesTags: ["Admins"],
    }),
    getUserTickets: build.query({
      query: ({ userId }) => ({
        url: "/management/admins/admin/tickets",
        method: "GET",
        params: { userId },
      }),
      providesTags: ["Admins"],
    }),
    getUserPerformance: build.query({
      query: (id) => `/management/performance/${id}`,
      providesTags: ["Performance"],
    }),
    getDashboard: build.query({
      query: () => "/general/dashboard",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetProductsQuery,
  useGetCustomersQuery,
  useGetTransactionsQuery,
  useGetGeographyQuery,
  useGetSalesQuery,
  useGetAdminsQuery,
  useUpdateAdminMutation,
  useEditAdminStatusMutation,
  useEditAdminRoleMutation,
  useAddAdminMutation,
  useGetAllTicketsQuery,
  useGetTicketQuery,
  useEditTicketStatusMutation,
  useGetUserTicketsQuery,
  useGetUserPerformanceQuery,
  useGetDashboardQuery,
} = api;
