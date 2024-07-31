import React from 'react';
import {
  Select, MenuItem, FormControl, InputLabel, Box, TextField,
  Typography, Button, Modal, Checkbox, FormControlLabel
} from '@mui/material';

const FilterSearch = ({
  years, selectedYear, handleYearChange, searchText, handleSearchTextChange,
  startDate, handleStartDateChange, endDate, handleEndDateChange,
  showBlackWhite, handleShowBlackWhiteChange, showColor, handleShowColorChange,
  searchUser, handleSearchUserChange, statuses, selectedStatus, handleStatusChange,
  divisions, selectedDivision, handleDivisionChange, onSearch  // Add onSearch prop
}) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearchClick = () => {
    onSearch();  // Call the onSearch function passed via props
    handleClose();  // Close the modal
  };

  return (
    <Box>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        value={searchText}
        onChange={handleSearchTextChange}
        sx={{ marginBottom: '16px', minWidth: 150, height: 56 }}
      />
      <Button onClick={handleOpen} variant="contained" size="large">
        FilterSearch
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Filters
          </Typography>
          <FormControl fullWidth variant="outlined" size="small" sx={{ mt: 2 }}>
            <InputLabel id="year-select-label">Select Year</InputLabel>
            <Select
              labelId="year-select-label"
              value={selectedYear}
              onChange={handleYearChange}
              label="Select Year"
            >
              <MenuItem value=""><em>All</em></MenuItem>
              {years.map((year) => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth variant="outlined" size="small" sx={{ mt: 2 }}>
            <InputLabel id="division-select-label">Select Division</InputLabel>
            <Select
              labelId="division-select-label"
              value={selectedDivision}
              onChange={handleDivisionChange}
              label="Select Division"
            >
              <MenuItem value=""><em>All</em></MenuItem>
              {divisions.map((division) => (
                <MenuItem key={division} value={division}>{division}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Search User"
            variant="outlined"
            size="small"
            value={searchUser}
            onChange={handleSearchUserChange}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            variant="outlined"
            size="small"
            sx={{ mt: 2 }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            variant="outlined"
            size="small"
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth variant="outlined" size="small" sx={{ mt: 2 }}>
            <InputLabel id="status-select-label">Select Status</InputLabel>
            <Select
              labelId="status-select-label"
              value={selectedStatus}
              onChange={handleStatusChange}
              label="Select Status"
            >
              <MenuItem value=""><em>All</em></MenuItem>
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox checked={showBlackWhite} onChange={handleShowBlackWhiteChange} />
            }
            label="Black & White"
            sx={{ mt: 2 }}
          />
          <FormControlLabel
            control={
              <Checkbox checked={showColor} onChange={handleShowColorChange} />
            }
            label="Color"
            sx={{ mt: 2 }}
          />
          <Button onClick={handleSearchClick} variant="contained" size="large" sx={{ mt: 2 }}>
            Search
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default FilterSearch;
