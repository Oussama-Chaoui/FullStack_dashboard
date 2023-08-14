import { Button, Modal, TextField, Typography, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import FlexBetween from "components/FlexBetween";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useEditAdminStatusMutation, useGetUserQuery } from "state/api";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import { addDays } from "date-fns";
import { isBefore } from "date-fns";

const SuspendAdminModal = ({ open, handleClose, id }) => {
  const tomorrow = addDays(new Date(), 1);

  const [endDate, setEndDate] = useState(tomorrow);
  const { data, isLoading } = useGetUserQuery(id);
  const [editAdminStatus] = useEditAdminStatusMutation();
  const [doc, setDoc] = useState("");

  const adminId = useSelector((state) => state.global.userId);

  const theme = useTheme();

  console.log(endDate);

  const handleApply = () => {
    editAdminStatus({
      userId: id,
      adminId: adminId,
      ticketStatus: "approved",
      doc: doc,
      type: "suspension",
      endDate: endDate,
      status: "suspended",
    });

    handleClose();
  };

  const handleSuspensionReasonChange = (e) => {
    setDoc(e.target.value);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 3,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: "5px",
    rowGap: "2rem",
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography variant="h3" component="h2">
          Suspend the activities of: {!isLoading && data.name}
        </Typography>

        <FlexBetween>
          <Typography variant="h5">
            Please select the duration of the suspension
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              minDate={tomorrow}
              label="Suspended until"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
            />
          </LocalizationProvider>
        </FlexBetween>

        <Box display="flex" flexDirection="column" rowGap="1rem">
          <Typography>
            Please provide a detailed report why this admin is getting suspended
          </Typography>

          <TextField
            sx={{ width: "100%", fontSize: "30px" }}
            id="outlined-multiline-flexible"
            multiline
            maxRows={4}
            label="Suspension Reason"
            value={doc}
            onChange={handleSuspensionReasonChange}
            required
          />
        </Box>

        <Box display="flex" sx={{ justifyContent: "space-between" }}>
          <Button
            sx={
              theme.palette.mode === "dark"
                ? { color: "white" }
                : { color: "black" }
            }
            size="large"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            disabled={
              endDate === null ||
              endDate === "" ||
              isBefore(endDate, new Date()) ||
              doc === ""
            }
            sx={
              theme.palette.mode === "dark"
                ? { color: "white" }
                : { color: "black" }
            }
            size="large"
            onClick={handleApply}
          >
            Sure
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SuspendAdminModal;
