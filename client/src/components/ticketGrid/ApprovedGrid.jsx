import { InfoOutlined } from "@mui/icons-material";
import { Box, IconButton, useTheme } from "@mui/material";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import Header from "components/Header";
import React from "react";
import { Link } from "react-router-dom";
import { useGetAllTicketsQuery } from "state/api";

const ApprovedGrid = ({ user }) => {
  const theme = useTheme();
  const { data, isLoading } = useGetAllTicketsQuery({
    role: user.data.role,
    status: "approved",
  });

  const customLocaleText = {
    noRowsLabel: "No approved tickets", // Replace with your desired text
  };

  const columns = [
    {
      field: "userName",
      headerName: "Created By",
      type: "string",
      flex: 0.7,
      valueGetter: (params) => {
        const ticket = params.row;
        const userName = ticket.user.name; // Assuming user name is available in the "name" field of the user object
        return userName;
      },
    },
    {
      field: "adminName",
      headerName: "Approved By",
      type: "string",
      flex: 0.7,
      valueGetter: (params) => {
        const ticket = params.row;
        const adminName = ticket.admin.name; // Assuming user name is available in the "name" field of the user object
        return adminName;
      },
    },
    {
      field: "startDate",
      headerName: "Starting date",
      type: "date",
      flex: 0.5,
      editable: true,
      valueFormatter: (params) => {
        const startDate = new Date(params.value);
        return startDate.toLocaleDateString();
      },
    },
    {
      field: "endDate",
      headerName: "Ending date",
      type: "date",
      flex: 0.5,
      editable: true,
      valueFormatter: (params) => {
        const endDate = new Date(params.value);
        return endDate.toLocaleDateString();
      },
    },
    {
      field: "status",
      headerName: "Status",
      type: "string",
      flex: 0.5,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 0.5,
    },
    {
      field: "doc",
      headerName: "Reason",
      type: "string",
      flex: 1,
      editable: true,
    },
    {
      field: "details",
      headerName: "Details",
      sortable: false,
      filterable: false,
      flex: 0.3,
      renderCell: (params) => (
        <IconButton component={Link} to={`/admin/tickets/${params.id}`}>
          <InfoOutlined />
        </IconButton>
      ),
    },
  ];

  return (
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
        rows={data || []}
        getRowHeight={() => "auto"}
        localeText={customLocaleText}
        sx={{
          [`& .${gridClasses.cell}`]: {
            py: 1.5,
          },
        }}
        editMode="row"
        columns={columns}
      />
    </Box>
  );
};

export default ApprovedGrid;
