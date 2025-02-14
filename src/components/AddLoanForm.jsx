import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Grid, 
  InputAdornment,
  CircularProgress
} from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { AccountBalance, Percent, CalendarToday } from '@material-ui/icons';

const AddLoanForm = ({ onSubmit, loading = false }) => {
  const [loanData, setLoanData] = useState({
    loanName: '',
    amount: '',
    interest: '',
    dueDate: new Date(),
  });
  const [errors, setErrors] = useState({
    loanName: false,
    amount: false,
    interest: false,
    dueDate: false
  });

  const handleChange = (e) => {
    setLoanData({ ...loanData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: false });
  };

  const handleDateChange = (date) => {
    setLoanData({ ...loanData, dueDate: date });
    setErrors({ ...errors, dueDate: false });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {
      loanName: !loanData.loanName.trim(),
      amount: !loanData.amount || parseFloat(loanData.amount) <= 0,
      interest: !loanData.interest || parseFloat(loanData.interest) < 0,
      dueDate: !loanData.dueDate || loanData.dueDate < new Date()
    };

    if (Object.values(newErrors).some(error => error)) {
      setErrors(newErrors);
      return;
    }

    if (onSubmit) {
      onSubmit(loanData);
      if (!loading) {
        setLoanData({
          loanName: '',
          amount: '',
          interest: '',
          dueDate: new Date(),
        });
      }
    }
  };

  return (
    <Paper elevation={3} style={{ 
      padding: '2rem', 
      margin: '2rem 0',
      borderRadius: '12px',
      border: '1px solid #e0e0e0',
      backgroundColor: '#f5f5f5',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      zIndex: 1
    }}>
      <Typography variant="h5" gutterBottom>
        Add New Loan
      </Typography>
      <form onSubmit={handleSubmit} noValidate autoComplete="off">
        <TextField
          name="loanName"
          label="Loan Name"
          placeholder="Home Loan, Personal Loan..."
          value={loanData.loanName}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          margin="normal"
          error={errors.loanName}
          helperText={errors.loanName && "Please enter a loan name"}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountBalance color="action" />
              </InputAdornment>
            ),
          }}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="amount"
              label="Loan Amount"
              type="number"
              value={loanData.amount}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              margin="normal"
              error={errors.amount}
              helperText={errors.amount && "Please enter a valid amount"}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <span style={{ color: '#757575' }}>$</span>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="interest"
              label="Interest Rate"
              type="number"
              value={loanData.interest}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              margin="normal"
              error={errors.interest}
              helperText={errors.interest && "Invalid interest rate"}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Percent style={{ color: '#757575' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            label="Due Date"
            inputVariant="outlined"
            value={loanData.dueDate}
            onChange={handleDateChange}
            format="MM/dd/yyyy"
            fullWidth
            margin="normal"
            error={errors.dueDate}
            helperText={errors.dueDate && "Please select a future date"}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarToday color="action" />
                </InputAdornment>
              ),
            }}
            style={{ marginBottom: '1rem' }}
          />
        </MuiPickersUtilsProvider>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{ 
            marginTop: '1rem',
            padding: '12px 24px',
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '1rem'
          }}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Submitting...' : 'Create Loan'}
        </Button>
      </form>
    </Paper>
  );
};

export default AddLoanForm; 