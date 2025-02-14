import React from 'react';
import { Card, CardContent, Typography, Grid, Button, TextField } from '@material-ui/core';

export default function LoansSection({ loans, onAddLoan }) {
  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Loans
      </Typography>
      
      {/* Search Field */}
      <TextField 
        variant="outlined"
        placeholder="Search loans..."
        fullWidth
        style={{ marginBottom: '1rem' }}
      />
      
      {/* Loans list in a responsive grid */}
      <Grid container spacing={3}>
        {loans.map(loan => (
          <Grid item xs={12} sm={6} md={4} key={loan.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {loan.name}
                </Typography>
                <Typography color="textSecondary">
                  Amount: ${loan.amount}
                </Typography>
                <Typography color="textSecondary">
                  Due: {loan.dueDate}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add New Loan Button */}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={onAddLoan} 
        style={{ marginTop: '2rem' }}
      >
        Add New Loan
      </Button>
    </div>
  );
} 