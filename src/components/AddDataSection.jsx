import { TextField, Button, Typography, Paper, RadioGroup, FormControlLabel, Radio, FormLabel, FormControl } from '@material-ui/core';

const AddDataSection = () => {
  const [entry, setEntry] = useState({ transactionType: 'borrow', description: '', amount: '' });

  const handleChange = (e) => {
    setEntry({ ...entry, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(entry);
    setEntry({ transactionType: 'borrow', description: '', amount: '' });
  };

  return (
    <Paper>
      <Typography variant="h5" gutterBottom>
        Add Borrow/Lend Entry
      </Typography>
      <form onSubmit={handleSubmit} noValidate autoComplete="off">
        <FormControl component="fieldset" style={{ marginBottom: '1rem' }}>
          <FormLabel component="legend">Transaction Type</FormLabel>
          <RadioGroup
            row
            name="transactionType"
            value={entry.transactionType}
            onChange={handleChange}
          >
            <FormControlLabel value="borrow" control={<Radio color="primary" />} label="Borrow" />
            <FormControlLabel value="lend" control={<Radio color="primary" />} label="Lend" />
          </RadioGroup>
        </FormControl>
        <TextField 
          name="description"
          label="Description"
          value={entry.description}
          onChange={handleChange}
          variant="outlined"
          fullWidth 
          margin="normal"
        />
        <TextField 
          name="amount"
          label="Amount"
          type="number"
          value={entry.amount}
          onChange={handleChange}
          variant="outlined"
          fullWidth 
          margin="normal"
        />
        <Button 
          variant="contained" 
          color="primary" 
          type="submit" 
          style={{ marginTop: '1rem' }}
        >
          Submit Entry
        </Button>
      </form>
    </Paper>
  );
};

export default AddDataSection; 