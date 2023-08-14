import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Header from "components/Header";
import SelectEditInputCell from "components/adminGrid/SelectEditInputCell";
import PendingGrid from "components/ticketGrid/PendingGrid";
import ApprovedGrid from "components/ticketGrid/ApprovedGrid";
import DeclinedGrid from "components/ticketGrid/DeclinedGrid";
import FlexBetween from "components/FlexBetween";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import AddTicketModal from "components/ticketGrid/AddTicketModal";
import MyTickets from "components/ticketGrid/MyTickets";
import { useGetUserTicketsQuery } from "state/api";

const Tickets = ({ user }) => {
  const [status, setStatus] = useState("pending");

  const { data, isLoading } = useGetUserTicketsQuery({ userId: user.data._id });

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const subtitle =
    user.data.role === "owner" || user.data.role === "superadmin"
      ? "Managing tickets and ticket requests"
      : "Add and manage your tickets";

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClick = () => {
    console.log("clicked");
    setOpen(true);
  };

  if (user.data.role === "owner" || user.data.role === "superadmin") {
    return (
      <Box m="1.5rem 2.5rem">
        <FlexBetween>
          <Header title="TICKETS" subtitle={subtitle} />

          <FormControl>
            <InputLabel>Status</InputLabel>
            <Select value={status} onChange={handleChange}>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="declined">Declined</MenuItem>
              <MenuItem value="mine">Mine</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>

        {status === "pending" && <PendingGrid user={user} />}
        {status === "approved" && <ApprovedGrid user={user} />}
        {status === "declined" && <DeclinedGrid user={user} />}
        {status === "mine" && <MyTickets user={user} />}
      </Box>
    );
  }

  if (user.data.role === "admin") {
    console.log("im inside this jsx");
    const hasPendingTicket =
      data !== null
        ? data && data?.some((ticket) => ticket.status === "pending")
        : false;
    return <MyTickets user={user} />;
  }
};

export default Tickets;
