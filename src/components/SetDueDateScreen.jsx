import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

export default function SetDueDateScreen({ open, onClose, onDueDateSet }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSetDueDate = () => {
    // Pass the selected date to the parent callback
    if (onDueDateSet) {
      onDueDateSet(selectedDate);
    }
    onClose();
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="set-due-date-dialog"
        fullWidth
        PaperProps={{ style: { backgroundColor: '#f5f5f5' } }}
      >
        <DialogTitle
          id="set-due-date-dialog"
          style={{ backgroundColor: '#3f51b5', color: '#fff', padding: '1rem' }}
        >
          Set Due Date
        </DialogTitle>
        <DialogContent dividers style={{ backgroundColor: '#fafafa', padding: '1rem' }}>
          <DatePicker
            autoOk
            variant="inline"
            inputVariant="outlined"
            value={selectedDate}
            onChange={handleDateChange}
            format="MM/dd/yyyy"
            margin="normal"
            fullWidth
          />
        </DialogContent>
        <DialogActions style={{ backgroundColor: '#fafafa', padding: '1rem' }}>
          <Button onClick={onClose} style={{ color: '#3f51b5' }}>
            Cancel
          </Button>
          <Button onClick={handleSetDueDate} style={{ backgroundColor: '#3f51b5', color: '#fff' }}>
            Set Due Date
          </Button>
        </DialogActions>
      </Dialog>
    </MuiPickersUtilsProvider>
  );
} 