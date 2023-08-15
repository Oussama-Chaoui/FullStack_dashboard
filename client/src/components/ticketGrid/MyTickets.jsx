import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

import {
  useEditAdminStatusMutation,
  useEditTicketStatusMutation,
  useGetTicketQuery,
  useGetUserTicketsQuery,
} from "state/api";
import { format } from "date-fns";
import AddTicketModal from "./AddTicketModal";

const MyTickets = ({ user }) => {
  const { id } = useParams();
  const theme = useTheme();
  const { data, isLoading } = useGetUserTicketsQuery({ userId: user.data._id });

  const handleDetailedTime = (timestamp) => {
    const date = new Date(timestamp);

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "UTC",
    };

    return date.toLocaleDateString("en-US", options);
  };

  const styles = {
    approved: {
      color: theme.palette.mode === "dark" ? "#0FFF50" : "#32CD32",
    },
    declined: {
      color: theme.palette.mode === "dark" ? "#DC143C" : "#D2042D",
    },
    pending: {
      color: theme.palette.mode === "dark" ? "#FFBF00" : "#FFC000",
    },
  };

  const [editTicketStatus] = useEditTicketStatusMutation();
  const [editAdminStatus] = useEditAdminStatusMutation();

  const headerStyle = {
    fontWeight: 500,
    letterSpacing: "2px",
    fontSize: "1rem",
  };

  const textStyle = {
    fontWeight: 300,
    letterSpacing: "1px",
    fontSize: "1rem",
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClick = () => {
    setOpen(true);
  };

  const hasPendingTicket =
    data !== null
      ? data && data?.some((ticket) => ticket.status === "pending")
      : false;

  if (user.data.role === "owner" || user.data.role === "superadmin") {
    return (
      <Box>
        <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={handleClick}
            disabled={hasPendingTicket}
          >
            Add a ticket
          </Button>
        </Box>
        {open && (
          <AddTicketModal user={user} open={open} handleClose={handleClose} />
        )}
        <Box mt="2rem">
          {data &&
            data.map((ticket) => (
              <Accordion
                key={ticket._id}
                sx={{
                  margin: "15px auto",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  width: "100%",
                  borderRadius: "10px",
                  padding: "0.8rem",
                  backdropFilter: "blur(10px)",

                  "& .MuiAccordionSummary-content": {
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography
                    sx={{
                      fontSize: "1.5rem",
                      letterSpacing: "2px",
                      fontWeight: "500",
                    }}
                  >
                    {ticket.type.charAt(0).toUpperCase() + ticket.type.slice(1)}{" "}
                    Ticket
                  </Typography>
                  <Typography
                    mr="2rem"
                    sx={{ ...styles[ticket.status], fontWeight: "bold" }}
                  >
                    {ticket.status.charAt(0).toUpperCase() +
                      ticket.status.slice(1)}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Render ticket details here */}
                  <Typography sx={headerStyle}>
                    Ticket Id: <span style={textStyle}>{ticket._id}</span>
                  </Typography>
                  <Typography sx={headerStyle}>
                    Ticket created at :{" "}
                    <span style={textStyle}>
                      {handleDetailedTime(ticket.createdAt)}
                    </span>
                  </Typography>
                  {ticket.status !== "pending" && (
                    <Typography sx={headerStyle}>
                      Ticket {ticket.status} at :{" "}
                      <span style={textStyle}>
                        {handleDetailedTime(ticket.updatedAt)}
                      </span>
                    </Typography>
                  )}
                  {ticket.status !== "pending" && (
                    <Typography sx={headerStyle}>
                      Ticket {ticket.status} By :{" "}
                      <span style={textStyle}>{ticket.admin.name}</span>
                    </Typography>
                  )}
                  {ticket.status !== "pending" && (
                    <Typography sx={headerStyle}>
                      {ticket.admin.name}'s email is :{" "}
                      <span style={textStyle}>{ticket.admin.email}</span>
                    </Typography>
                  )}
                  {ticket.status !== "pending" && (
                    <Typography sx={headerStyle}>
                      {ticket.admin.name}'s role is :{" "}
                      <span style={textStyle}>{ticket.admin.role}</span>
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
        </Box>
      </Box>
    );
  }
  if (user.data.role === "admin") {
    return (
      <Box m="1.5rem 2.5rem">
        <FlexBetween>
          <Header title="TICKETS" subtitle="Add and check your tickets" />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={handleClick}
            disabled={hasPendingTicket}
          >
            Add a ticket
          </Button>
        </FlexBetween>
        {open && (
          <AddTicketModal user={user} open={open} handleClose={handleClose} />
        )}
        <Box mt="2rem">
          {data &&
            data.map((ticket) => (
              <Accordion
                key={ticket._id}
                sx={{
                  margin: "15px auto",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  width: "100%",
                  borderRadius: "10px",
                  padding: "0.8rem",
                  backdropFilter: "blur(10px)",

                  "& .MuiAccordionSummary-content": {
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography
                    sx={{
                      fontSize: "1.5rem",
                      letterSpacing: "2px",
                      fontWeight: "500",
                    }}
                  >
                    {ticket.type.charAt(0).toUpperCase() + ticket.type.slice(1)}{" "}
                    Ticket
                  </Typography>
                  <Typography
                    mr="2rem"
                    sx={{ ...styles[ticket.status], fontWeight: "bold" }}
                  >
                    {ticket.status.charAt(0).toUpperCase() +
                      ticket.status.slice(1)}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Render ticket details here */}
                  <Typography sx={headerStyle}>
                    Ticket Id: <span style={textStyle}>{ticket._id}</span>
                  </Typography>
                  <Typography sx={headerStyle}>
                    Ticket created at :{" "}
                    <span style={textStyle}>
                      {handleDetailedTime(ticket.createdAt)}
                    </span>
                  </Typography>
                  {ticket.status !== "pending" && (
                    <Typography sx={headerStyle}>
                      Ticket {ticket.status} at :{" "}
                      <span style={textStyle}>
                        {handleDetailedTime(ticket.updatedAt)}
                      </span>
                    </Typography>
                  )}
                  {ticket.status !== "pending" && (
                    <Typography sx={headerStyle}>
                      Ticket {ticket.status} By :{" "}
                      <span style={textStyle}>{ticket.admin.name}</span>
                    </Typography>
                  )}
                  {ticket.status !== "pending" && (
                    <Typography sx={headerStyle}>
                      {ticket.admin.name}'s email is :{" "}
                      <span style={textStyle}>{ticket.admin.email}</span>
                    </Typography>
                  )}
                  {ticket.status !== "pending" && (
                    <Typography sx={headerStyle}>
                      {ticket.admin.name}'s role is :{" "}
                      <span style={textStyle}>{ticket.admin.role}</span>
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
        </Box>
      </Box>
    );
  }
};

export default MyTickets;
