import {
  Autocomplete,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  Modal,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  addDays,
  differenceInDays,
  eachDayOfInterval,
  isBefore,
  isSameDay,
  isWeekend,
  subMinutes,
} from "date-fns";
import { useEditAdminStatusMutation } from "state/api";
import { startOfDay } from "date-fns";

const AddTicketModal = ({ open, handleClose, user }) => {
  const [editAdminStatus] = useEditAdminStatusMutation();

  const theme = useTheme();
  const [choice, setChoice] = useState("");

  const today = new Date();
  const tomorrow = addDays(new Date(), 1);

  const [sickStartDate, setSickStartDate] = useState(today);
  const [sickEndDate, setSickEndDate] = useState(today);

  const [vacationStartDate, setVacationStartDate] = useState(tomorrow);
  const [vacationEndDate, setVacationEndDate] = useState(tomorrow);
  const [vacationMaxDate, setVacationMaxDate] = useState(today);
  const [vacationMaxDays, setVacationMaxDays] = useState(0);

  const roundedStartDate = startOfDay(vacationStartDate);

  const [vacationStartDateError, setVacationStartDateError] = useState(null);

  const vacationStartDateErrorMessage = React.useMemo(() => {
    switch (vacationStartDateError) {
      case "maxDate": {
        return "The selected date is beyond the supported date range. Please choose a valid date within the supported range.";
      }
      case "minDate": {
        return "Please select a date from tomorrow onwards for your vacation. You cannot select past dates.";
      }

      case "invalidDate": {
        return "Your date is not valid";
      }

      default: {
        return "";
      }
    }
  }, [vacationStartDateError]);

  const [vacationEndDateError, setVacationEndDateError] = useState(null);

  const vacationEndDateErrorMessage = React.useMemo(() => {
    switch (vacationEndDateError) {
      case "maxDate": {
        return "Your vacation end date exceeds your vacation credit days. Please adjust the end date";
      }
      case "minDate": {
        return "The end date cannot be before the start date. Please choose a valid date range for your vacation.";
      }

      case "invalidDate": {
        return "Your date is not valid";
      }

      default: {
        return "";
      }
    }
  }, [vacationEndDateError]);

  const [doc, setDoc] = useState("");

  const calculateMaxDate = (startDate) => {
    let maxDate = new Date(startDate);
    let daysToAdd = user.data.vCredit - 1;

    while (daysToAdd > 0) {
      maxDate = addDays(maxDate, 1);

      // Check if the current day is not a weekend (Saturday or Sunday)
      if (!isWeekend(maxDate)) {
        daysToAdd--;
      }
    }

    return maxDate;
  };

  useEffect(() => {
    // Calculate the maxDate when the vCredit or today changes
    const maxDate = calculateMaxDate(vacationStartDate);
    setVacationMaxDate(maxDate);
    setVacationEndDate(maxDate);

    try {
      const allDates = eachDayOfInterval({
        start: vacationStartDate,
        end: vacationEndDate,
      });

      // Filter out weekend days
      const weekdays = allDates.filter((date) => !isWeekend(date));

      // Calculate the number of weekdays to reduce from vCredit
      const daysToReduce = weekdays.length;

      setVacationMaxDays(daysToReduce);
    } catch (error) {
      console.error(error.message);
    }
  }, [vacationStartDate, user.data.vCredit, choice]);

  const bothDatePickersDisabled = user.data.vCredit === 0;

  const handleDocChange = (e) => {
    setDoc(e.target.value);
  };

  const subtitle =
    choice === ""
      ? "Please choose what kind of ticket you would like to submit"
      : "Please fill out this form";

  const handleApply = () => {
    if (choice === "sick leave") {
      editAdminStatus({
        userId: user.data._id,
        startDate: sickStartDate,
        endDate: sickEndDate,
        type: "sick leave",
        doc: doc,
        status: "sick leave",
      });

      handleClose();
    }

    if (choice === "vacation") {
      editAdminStatus({
        userId: user.data._id,
        startDate: vacationStartDate,
        endDate: vacationEndDate,
        type: "vacation",
        status: "vacation",
      });

      handleClose();
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 3,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    rowGap: "2rem",
    borderRadius: "5px",
    transition: "height 300ms ease-in-out",
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
          Add a ticket
        </Typography>
        <Typography variant="h5">{subtitle}</Typography>

        {/* First Box with the choices */}
        {choice === "" && (
          <Box display="flex" justifyContent="space-around" alignItems="center">
            <Button
              size="large"
              variant="outlined"
              sx={
                theme.palette.mode === "dark"
                  ? { color: "white" }
                  : { color: "black" }
              }
              onClick={() => setChoice("sick leave")}
            >
              Sick leave
            </Button>
            <Button
              size="large"
              variant="outlined"
              sx={
                theme.palette.mode === "dark"
                  ? { color: "white" }
                  : { color: "black" }
              }
              onClick={() => setChoice("vacation")}
            >
              Vacation
            </Button>
          </Box>
        )}

        {/* Box with the sick leave choice */}
        {choice === "sick leave" && (
          <Box
            display="flex"
            flexDirection="column"
            rowGap="2rem"
            alignItems="center"
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                minDate={today}
                maxDate={sickEndDate}
                label="Start Date"
                value={sickStartDate}
                onChange={(newValue) => setSickStartDate(newValue)}
                sx={{ width: "100%" }}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                minDate={today}
                label="End Date"
                value={sickEndDate}
                onChange={(newValue) => setSickEndDate(newValue)}
                sx={{ width: "100%" }}
              />
            </LocalizationProvider>

            <TextField
              sx={{ width: "100%" }}
              id="outlined-multiline-flexible"
              multiline
              maxRows={4}
              label="Document"
              value={doc}
              onChange={handleDocChange}
              required
            />
          </Box>
        )}

        {/* Box with the vacation choice  */}
        {choice === "vacation" && (
          <Box
            display="flex"
            flexDirection="column"
            rowGap="2rem"
            alignItems="left"
          >
            <Typography fontWeight="600">
              Your credit is {user.data.vCredit} days
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                onError={(newError) => setVacationStartDateError(newError)}
                slotProps={{
                  textField: {
                    helperText: vacationStartDateErrorMessage,
                  },
                }}
                minDate={tomorrow}
                label="Start Date"
                value={vacationStartDate}
                disabled={bothDatePickersDisabled}
                onChange={(newValue) => setVacationStartDate(newValue)}
                sx={{ width: "100%" }}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                onError={(newError) => setVacationEndDateError(newError)}
                slotProps={{
                  textField: {
                    helperText: vacationEndDateErrorMessage,
                  },
                }}
                minDate={vacationStartDate}
                maxDate={vacationMaxDate}
                label="End Date"
                value={vacationEndDate}
                disabled={bothDatePickersDisabled}
                onChange={(newValue) => {
                  setVacationEndDate(newValue);
                  try {
                    const allDates = eachDayOfInterval({
                      start: vacationStartDate,
                      end: vacationEndDate,
                    });

                    // Filter out weekend days
                    const weekdays = allDates.filter(
                      (date) => !isWeekend(date)
                    );

                    // Calculate the number of weekdays to reduce from vCredit
                    const daysToReduce = weekdays.length;

                    setVacationMaxDays(daysToReduce);
                  } catch (error) {
                    console.error(error.message);
                  }
                }}
                sx={{ width: "100%" }}
              />
            </LocalizationProvider>
          </Box>
        )}

        {/* Cancel Button */}
        {/* First Box with the choices */}
        {choice === "" && (
          <Box display="flex" justifyContent="space-between">
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
          </Box>
        )}

        {/* Box with the Sick leave choice */}
        {choice === "sick leave" && (
          <Box display="flex" justifyContent="space-between">
            <Button
              sx={
                theme.palette.mode === "dark"
                  ? { color: "white" }
                  : { color: "black" }
              }
              size="large"
              onClick={() => setChoice("")}
            >
              Back
            </Button>

            <Button
              disabled={
                sickStartDate === null ||
                sickStartDate === "" ||
                isBefore(sickStartDate, subMinutes(new Date(), 1)) ||
                sickEndDate === null ||
                sickEndDate === "" ||
                isBefore(sickEndDate, subMinutes(new Date(), 1)) ||
                isBefore(sickEndDate, sickStartDate) ||
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
              Apply
            </Button>
          </Box>
        )}

        {/* Box with the vacation choice  */}
        {choice === "vacation" && (
          <Box display="flex" justifyContent="space-between">
            <Button
              sx={
                theme.palette.mode === "dark"
                  ? { color: "white" }
                  : { color: "black" }
              }
              size="large"
              onClick={() => setChoice("")}
            >
              Back
            </Button>

            <Button
              disabled={
                vacationStartDate === null ||
                JSON.stringify(vacationStartDate) === "null" ||
                vacationEndDate === null ||
                JSON.stringify(vacationEndDate) === "null" ||
                isBefore(
                  new Date(vacationEndDate),
                  new Date(vacationStartDate)
                ) ||
                isBefore(new Date(vacationStartDate), new Date()) ||
                isBefore(new Date(vacationEndDate), new Date()) ||
                isSameDay(new Date(vacationStartDate), new Date()) ||
                isSameDay(new Date(vacationEndDate), new Date()) ||
                vacationEndDateError !== null ||
                vacationStartDateError !== null ||
                user.data.vCredit === 0
              }
              sx={
                theme.palette.mode === "dark"
                  ? { color: "white" }
                  : { color: "black" }
              }
              size="large"
              onClick={handleApply}
            >
              Apply
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default AddTicketModal;
