import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "components/Header";
import StatusField from "components/adminGrid/StatusField";
import { format } from "date-fns";
import React from "react";
import { useGetAdminsQuery, useGetAllTicketsQuery } from "state/api";

const InactiveAdmin = ({ user }) => {
  // const { data, isLoading } = useGetAdminsQuery({
  //   role: user.data.role,
  //   status: "inactive",
  // });

  const { data, isLoading } = useGetAllTicketsQuery({
    role: "owner",
    status: "approved",
  });

  console.log(data);

  const nonExpiredTickets =
    data &&
    data.filter(
      (ticket) => !ticket.isExpired && ticket.user.status !== "active"
    );

  console.log(nonExpiredTickets);

  const theme = useTheme();

  const columns = [
    {
      field: "name",
      headerName: "Name",
      type: "string",
      flex: 0.5,
      valueGetter: (params) => {
        const ticket = params.row;
        const userName = ticket.user.name;
        return userName;
      },
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      valueGetter: (params) => {
        const ticket = params.row;
        const email = ticket.user.email;
        return email;
      },
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0.5,
      valueGetter: (params) => {
        const ticket = params.row;
        const role = ticket.user.role;
        return role;
      },
    },
    {
      field: "status",
      headerName: "Status",
      type: "string",
      flex: 0.4,
      valueGetter: (params) => {
        const ticket = params.row;
        const status = ticket.user.status;
        return status;
      },
      renderCell: (params) => {
        console.log(params);
        if (params.row !== undefined) return <StatusField params={params} />;
      },
    },
    {
      field: "startDate",
      headerName: "Start Date",
      type: "string",
      flex: 0.8,
      valueGetter: (params) => {
        const ticket = params.row;
        const startDate = new Date(ticket.startDate);
        return format(startDate, "MM/dd/yyyy HH:mm:ss");
      },
    },
    {
      field: "endDate",
      headerName: "End Date",
      type: "string",
      flex: 0.8,
      valueGetter: (params) => {
        const ticket = params.row;
        const endDate = new Date(ticket.endDate);
        return format(endDate, "MM/dd/yyyy HH:mm:ss");
      },
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="INACTIVE ADMINS" subtitle="List of inactive admins" />
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer": {
            color: `${theme.palette.secondary[200]} !important`,
          },
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
            width: "0.5rem",
          },
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track": {
            background:
              theme.palette.mode === "dark"
                ? theme.palette.grey[800]
                : theme.palette.secondary[300],

            borderRadius: "5px",
          },
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.mode === "dark" ? "#888" : "#F3E5AB",
            borderRadius: "5px",
          },
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb:hover": {
            background:
              theme.palette.mode === "dark"
                ? "white"
                : theme.palette.secondary[100],
          },
        }}
      >
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={nonExpiredTickets || []}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default InactiveAdmin;
