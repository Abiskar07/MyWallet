import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  overrides: {
    MuiPaper: {
      root: {
        backgroundColor: '#f5f5f5', // Global paper background
      }
    }
  }
});