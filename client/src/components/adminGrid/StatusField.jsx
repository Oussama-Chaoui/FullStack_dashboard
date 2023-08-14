import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import SickIcon from "@mui/icons-material/Sick";

const StatusField = (params) => {
  const status = params.params.value;

  const theme = useTheme();

  if (status === "active") {
    if (theme.palette.mode === "dark") {
      const color = "#0FFF50";
      return (
        <Box display="flex" alignItems="center" columnGap="3px">
          <CheckCircleOutlinedIcon sx={{ color: color }} />
          <Typography color={color}>{status}</Typography>
        </Box>
      );
    } else {
      const color = "#32CD32";
      return (
        <Box display="flex" alignItems="center" columnGap="3px">
          <CheckCircleOutlinedIcon sx={{ color: color }} />
          <Typography color={color}>{status}</Typography>
        </Box>
      );
    }
  }

  if (status === "suspended") {
    if (theme.palette.mode === "dark") {
      const color = "#DC143C";
      return (
        <Box display="flex" alignItems="center" columnGap="3px">
          <ReportGmailerrorredOutlinedIcon sx={{ color: color }} />
          <Typography color={color} sx={{ fontWeight: "bold" }}>
            {status}
          </Typography>
        </Box>
      );
    } else {
      const color = "#D2042D";
      return (
        <Box display="flex" alignItems="center" columnGap="3px">
          <ReportGmailerrorredOutlinedIcon sx={{ color: color }} />
          <Typography color={color}>{status}</Typography>
        </Box>
      );
    }
  }

  if (status === "vacation") {
    if (theme.palette.mode === "dark") {
      const color = "#32fcde";
      return (
        <Box display="flex" alignItems="center" columnGap="3px">
          <BeachAccessIcon sx={{ color: color }} />
          <Typography color={color}>{status}</Typography>
        </Box>
      );
    } else {
      const color = "#23baa4";
      return (
        <Box display="flex" alignItems="center" columnGap="3px">
          <BeachAccessIcon sx={{ color: color }} />
          <Typography color={color}>{status}</Typography>
        </Box>
      );
    }
  }

  if (status === "sick leave") {
    if (theme.palette.mode === "dark") {
      const color = "#FFBF00";
      return (
        <Box display="flex" alignItems="center" columnGap="3px">
          <SickIcon sx={{ color: color }} />
          <Typography color={color}>{status}</Typography>
        </Box>
      );
    } else {
      const color = "#FFC000";
      return (
        <Box display="flex" alignItems="center" columnGap="3px">
          <SickIcon sx={{ color: color }} />
          <Typography color={color}>{status}</Typography>
        </Box>
      );
    }
  }
};

export default StatusField;
