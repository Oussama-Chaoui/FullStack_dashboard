import { Select } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid";

const SelectEditInputCell = (props) => {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();

  const handleChange = async (event) => {
    await apiRef.current.setEditCellValue({
      id,
      field,
      value: event.target.value,
    });

    apiRef.current.stopCellEditMode({ id, field });
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      size="normal"
      sx={{ height: 1 }}
      native
    >
      <option>superadmin</option>
      <option>admin</option>
    </Select>
  );
};

export default SelectEditInputCell;
