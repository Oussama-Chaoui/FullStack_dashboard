import React, { useState } from "react";
import { Button } from "@mui/material";
import { GridRowModes, GridToolbarContainer } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import AddAdminModal from "./AddAdminModal";

const EditToolbar = ({}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClick = () => {
    console.log("clicked");
    setOpen(true);
  };

  return (
    <GridToolbarContainer>
      <Button color="secondary" startIcon={<AddIcon />} onClick={handleClick}>
        Add Admin
      </Button>
      {open && <AddAdminModal open={open} handleClose={handleClose} />}
    </GridToolbarContainer>
  );
};

export default EditToolbar;
