import {
  Autocomplete,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Modal,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import React, { useMemo, useState } from "react";
import {
  useAddAdminMutation,
  useEditAdminRoleMutation,
  useGetCustomersQuery,
} from "state/api";
import CountryInput from "./CountryInput";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { countries } from "state/country";

const AddAdminModal = ({ open, handleClose }) => {
  const theme = useTheme();
  const [choice, setChoice] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [selectedRole, setSelectedRole] = useState("admin");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [occupation, setOccupation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [showPassword, setShowPassword] = React.useState(false);

  const { data, isLoading } = useGetCustomersQuery();

  const [editAdminRole] = useEditAdminRoleMutation();
  const [addAdminManualy] = useAddAdminMutation();
  // Get all the users's names and make an array to show suggestions while searching
  const users = useMemo(() => {
    if (data || !isLoading) {
      const names = data.map((user) => ({ id: user._id, name: user.name }));
      return names;
    }
  }, [data, isLoading]);

  const handleAlreadyExistingUser = () => {
    editAdminRole({
      id: nameValue.id,
      role: selectedRole,
    });
    handleClose();
  };

  const handleManualAdmin = () => {
    addAdminManualy({
      name: name,
      email: email,
      password: password,
      city: city,
      state: state,
      country: country.code,
      occupation: occupation,
      phoneNumber: phoneNumber,
    });
    handleClose();
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isValidEmail = (email) => {
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone number length validation function
  const isValidPhoneNumber = (phoneNumber) => {
    // Remove non-digit characters from the phone number
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");

    // Check if the cleaned phone number has 10 digits
    return cleanedPhoneNumber.length === 10;
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
          Add an Admin
        </Typography>
        <Typography variant="h5">
          Please choose the way you would want to add your admin
        </Typography>

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
              onClick={() => setChoice("exist")}
            >
              Already existing users
            </Button>
            <Button
              size="large"
              variant="outlined"
              sx={
                theme.palette.mode === "dark"
                  ? { color: "white" }
                  : { color: "black" }
              }
              onClick={() => setChoice("manual")}
            >
              Manualy
            </Button>
          </Box>
        )}

        {/* Box with the ALREADY EXISTING USER cho  ice */}
        {choice === "exist" && (
          <Box display="flex" justifyContent="space-around" alignItems="center">
            <Autocomplete
              value={nameValue}
              onChange={(event, newValue) => {
                setNameValue(newValue);
              }}
              disablePortal
              id="combo-box-demo"
              options={users}
              getOptionLabel={(user) => user.name || ""}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Users" />}
            />
            <Select
              value={selectedRole}
              onChange={handleRoleChange}
              size="normal"
              sx={{ height: 1 }}
              native
            >
              <option>admin</option>
              <option>superadmin</option>
            </Select>
          </Box>
        )}

        {/* Box with the choice MANUAL  */}
        {choice === "manual" && (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
          >
            <FormControl component="form">
              <Grid
                container
                spacing={3}
                sx={{ justifyContent: "space-evenly" }}
              >
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    sx={{ width: "100%" }} // Adjust the width here
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    sx={{ width: "100%" }} // Adjust the width here
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handlePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ width: "100%" }} // Adjust the width here
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    sx={{ width: "100%" }} // Adjust the width here
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    sx={{ width: "100%" }} // Adjust the width here
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    value={country}
                    onChange={(event, newValue) => setCountry(newValue)}
                    options={countries}
                    getOptionLabel={(option) => option.label || ""}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Country"
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Occupation"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    sx={{ width: "100%" }} // Adjust the width here
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    sx={{ width: "100%" }} // Adjust the width here
                  />
                </Grid>
              </Grid>
            </FormControl>
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

        {/* Box with the ALREADY EXISTING USER choice */}
        {choice === "exist" && (
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
                nameValue === "" ||
                nameValue === undefined ||
                nameValue === null
              }
              sx={
                theme.palette.mode === "dark"
                  ? { color: "white" }
                  : { color: "black" }
              }
              size="large"
              onClick={handleAlreadyExistingUser}
            >
              Apply
            </Button>
          </Box>
        )}

        {/* Box with the choice MANUAL  */}
        {choice === "manual" && (
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
                name === "" ||
                email === "" ||
                password === "" ||
                city === "" ||
                state === "" ||
                country === "" ||
                !isValidPhoneNumber(phoneNumber) ||
                !isValidEmail(email) ||
                occupation === "" ||
                phoneNumber === ""
              }
              sx={
                theme.palette.mode === "dark"
                  ? { color: "white" }
                  : { color: "black" }
              }
              size="large"
              onClick={handleManualAdmin}
            >
              Apply
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default AddAdminModal;
