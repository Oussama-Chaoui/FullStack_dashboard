import React, { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridRowModes, GridActionsCellItem } from "@mui/x-data-grid";
import Header from "components/Header";
import {
  useDeleteAdminMutation,
  useGetAdminsQuery,
  useUpdateAdminMutation,
} from "state/api";
import EditIcon from "@mui/icons-material/Edit";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import SelectEditInputCell from "components/adminGrid/SelectEditInputCell";
import EditToolbar from "components/adminGrid/EditToolbar";
import SuspendAdminModal from "components/adminGrid/SuspendAdminModal";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import StatusField from "components/adminGrid/StatusField";

const renderSelectEditInputCell = (params) => {
  return <SelectEditInputCell {...params} />;
};

const AdminOverview = ({ user }) => {
    const { data, isLoading } = useGetAdminsQuery({
      role: user.data.role,
      status: "active",
    });

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [id, setId] = useState("");

  const [updateAdmin] = useUpdateAdminMutation();

  const theme = useTheme();

  const columns =
    user.data.role === "owner" || user.data.role === "superadmin"
      ? [
          {
            field: "name",
            headerName: "Name",
            type: "string",
            flex: 0.5,
            editable: true,
          },
          {
            field: "email",
            headerName: "Email",
            flex: 1,
            editable: true,
          },
          {
            field: "phoneNumber",
            headerName: "Phone Number",
            type: "string",
            flex: 0.5,
            renderCell: (params) => {
              return params.value.replace(
                /^(\d{3})(\d{3})(\d{4})/,
                "($1)$2 - $3"
              );
            },
            editable: true,
          },
          {
            field: "country",
            headerName: "Country",
            type: "string",
            flex: 0.4,
            editable: true,
          },
          {
            field: "occupation",
            headerName: "Occupation",
            type: "string",
            flex: 1,
            editable: true,
          },
          {
            field: "role",
            headerName: "Role",
            renderEditCell: renderSelectEditInputCell,
            editable: true,
            flex: 0.5,
          },
          {
            field: "status",
            headerName: "Status",
            type: "string",
            flex: 0.4,
            renderCell: (params) => {
              if (params.value !== undefined)
                return <StatusField params={params} />;
            },
          },
          {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            cellClassName: "actions",
            flex: 0.3,
            getActions: ({ id }) => {
              const isInEditMode =
                rowModesModel[id]?.mode === GridRowModes.Edit;

              if (isInEditMode) {
                return [
                  <GridActionsCellItem
                    icon={<SaveIcon />}
                    label="Save"
                    onClick={handleSaveClick(id)}
                  />,
                  <GridActionsCellItem
                    icon={<CancelIcon />}
                    label="Cancel"
                    className="textPrimary"
                    onClick={handleCancelClick(id)}
                    color="inherit"
                  />,
                ];
              }

              return [
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label="Edit"
                  className="textPrimary"
                  onClick={handleEditClick(id)}
                  color="inherit"
                />,
                <GridActionsCellItem
                  icon={<ReportGmailerrorredOutlinedIcon />}
                  label="Delete"
                  onClick={handleDeleteClick(id)}
                  color="inherit"
                />,
              ];
            },
          },
        ]
      : [
          {
            field: "name",
            headerName: "Name",
            type: "string",
            flex: 0.5,
            editable: true,
          },
          {
            field: "email",
            headerName: "Email",
            flex: 1,
            editable: true,
          },
          {
            field: "phoneNumber",
            headerName: "Phone Number",
            type: "string",
            flex: 0.5,
            renderCell: (params) => {
              return params.value.replace(
                /^(\d{3})(\d{3})(\d{4})/,
                "($1)$2 - $3"
              );
            },
            editable: true,
          },
          {
            field: "country",
            headerName: "Country",
            type: "string",
            flex: 0.4,
            editable: true,
          },
          {
            field: "occupation",
            headerName: "Occupation",
            type: "string",
            flex: 1,
            editable: true,
          },
          {
            field: "role",
            headerName: "Role",
            renderEditCell: renderSelectEditInputCell,
            editable: true,
            flex: 0.5,
          },
          {
            field: "status",
            headerName: "Status",
            type: "string",
            flex: 0.4,
            renderCell: (params) => {
              if (params.value !== undefined)
                return <StatusField params={params} />;
            },
          },
        ];

  const [rowModesModel, setRowModesModel] = useState({});

  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    handleOpen();
    setId(id);
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };

    updateAdmin({
      id: updatedRow._id,
      user: updatedRow,
    });

    return updatedRow;
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="ADMINS" subtitle="Managing Admins and list of admins" />
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
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          columns={columns}
          processRowUpdate={processRowUpdate}
          onRowEditStart={handleRowEditStart}
          onRowEditStop={handleRowEditStop}
          slots={{
            toolbar:
              (user.data.role === "owner" || user.data.role === "superadmin") &&
              EditToolbar,
          }}
        />
      </Box>
      {open && (
        <SuspendAdminModal id={id} open={open} handleClose={handleClose} />
      )}
    </Box>
  );
};

export default AdminOverview;
