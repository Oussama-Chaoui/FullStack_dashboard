import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import React from "react";
import { useParams } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  useEditAdminStatusMutation,
  useEditTicketStatusMutation,
  useGetTicketQuery,
} from "state/api";
import { format } from "date-fns";

const Ticket = ({ user }) => {
  const { id } = useParams();

  const { data, isLoading } = useGetTicketQuery({
    role: user.data.role,
    id: id,
  });

  const handleTime = (time) => {
    const date = data && new Date(time);
    const formattedDate = data && format(date, "dd/MM/yyyy");

    return formattedDate;
  };

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

  const [editTicketStatus] = useEditTicketStatusMutation();
  const [editAdminStatus] = useEditAdminStatusMutation();

  const handleApprove = async () => {
    await editAdminStatus({
      ticketId: id,
      userId: data.userId,
      adminId: user.data._id,
      ticketStatus: "approved",
      status: data.type,
    });
    window.location.reload();
  };

  const handleDecline = async () => {
    await editAdminStatus({
      ticketId: id,
      userId: data.userId,
      adminId: user.data._id,
      ticketStatus: "declined",
      status: "",
    });
  };

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

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="Ticket Details" subtitle="" />
        <Stack direction="row" spacing={2}>
          {/* Approve or decline ticket if owner */}
          {data && data.status === "pending" && user.data.role === "owner" && (
            <>
              <Button
                variant="contained"
                color="success"
                onClick={handleApprove}
              >
                Approve Ticket
              </Button>
              <Button variant="outlined" color="error" onClick={handleDecline}>
                Decline Ticket
              </Button>
            </>
          )}

          {/* Approve or decline ticket if superadmin and user is admin */}
          {data &&
            data.status === "pending" &&
            user.data.role === "superadmin" &&
            data.user.role === "admin" && (
              <>
                <Button variant="contained" color="success">
                  Approve Ticket
                </Button>
                <Button variant="outlined" color="error">
                  Decline Ticket
                </Button>
              </>
            )}
        </Stack>
      </FlexBetween>

      {data && (
        <Box mt="2rem">
          {/* Ticket Details */}
          <Accordion
            sx={{
              margin: "15px auto",
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              width: "100%",
              borderRadius: "10px",
              padding: "0.8rem",
              backdropFilter: "blur(10px)",
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
                Ticket Details
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={headerStyle}>
                Tikcet id: <span style={textStyle}>{data._id}</span>
              </Typography>
              <Typography sx={headerStyle}>
                Ticket Type: <span style={textStyle}>{data.type}</span>
              </Typography>
              <Typography sx={headerStyle}>
                {data.type} starting date:{" "}
                <span style={textStyle}>{handleTime(data.startDate)}</span>
              </Typography>
              <Typography sx={headerStyle}>
                {data.type} ending date:{" "}
                <span style={textStyle}>{handleTime(data.endDate)}</span>
              </Typography>
              <Typography sx={headerStyle}>
                Ticket Status: <span style={textStyle}>{data.status}</span>
              </Typography>
              <Typography sx={headerStyle}>
                Ticket Doc: <span style={textStyle}>{data.doc}</span>
              </Typography>

              <Typography sx={headerStyle}>
                Ticket created at:{" "}
                <span style={textStyle}>
                  {handleDetailedTime(data.createdAt)}
                </span>
              </Typography>

              {data.status !== "pending" && (
                <Typography sx={headerStyle}>
                  Ticket {data.status} at:{" "}
                  <span style={textStyle}>
                    {handleDetailedTime(data.updatedAt)}
                  </span>
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>

          {/* User Details */}
          <Accordion
            sx={{
              margin: "15px auto",
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              width: "100%",
              borderRadius: "10px",
              padding: "0.8rem",
              backdropFilter: "blur(10px)",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography sx={{ fontSize: "1.5rem" }}>Created By</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={headerStyle}>
                Admin Id: <span style={textStyle}>{data.userId}</span>
              </Typography>
              <Typography sx={headerStyle}>
                Admin name: <span style={textStyle}>{data.user.name}</span>
              </Typography>
              <Typography sx={headerStyle}>
                Admin email: <span style={textStyle}>{data.user.email}</span>
              </Typography>
              <Typography sx={headerStyle}>
                Admin phone Number:{" "}
                <span style={textStyle}>{data.user.phoneNumber}</span>
              </Typography>
              <Typography sx={headerStyle}>
                Admin role: <span style={textStyle}>{data.user.role}</span>
              </Typography>
              <Typography sx={headerStyle}>
                Admin status: <span style={textStyle}>{data.user.status}</span>
              </Typography>
            </AccordionDetails>
          </Accordion>

          {/* Admin Details */}
          {data && data.status !== "pending" && (
            <Accordion
              sx={{
                margin: "15px auto",
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                width: "100%",
                borderRadius: "10px",
                padding: "0.8rem",
                backdropFilter: "blur(10px)",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography sx={{ fontSize: "1.5rem" }}>
                  {data.status.charAt(0).toUpperCase() + data.status.slice(1)}{" "}
                  By
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={headerStyle}>
                  Admin Id: <span style={textStyle}>{data.adminId}</span>
                </Typography>
                <Typography sx={headerStyle}>
                  Admin name: <span style={textStyle}>{data.admin.name}</span>
                </Typography>
                <Typography sx={headerStyle}>
                  Admin email: <span style={textStyle}>{data.admin.email}</span>
                </Typography>
                <Typography sx={headerStyle}>
                  Admin phone Number:{" "}
                  <span style={textStyle}>{data.admin.phoneNumber}</span>
                </Typography>
                <Typography sx={headerStyle}>
                  Admin role: <span style={textStyle}>{data.admin.role}</span>
                </Typography>
                <Typography sx={headerStyle}>
                  Admin status:{" "}
                  <span style={textStyle}>{data.admin.status}</span>
                </Typography>
              </AccordionDetails>
            </Accordion>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Ticket;
