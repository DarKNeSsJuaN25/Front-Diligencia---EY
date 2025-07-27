import { createTheme } from '@mui/material/styles';

const eyTheme = createTheme({
  palette: {
    primary: {
      main: '#333333',
      light: '#616161',
      dark: '#2e2e38',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FFE600',
      light: '#FFF066',
      dark: '#CCB800',
      contrastText: '#000000',
    },
    error: {
      main: '#ef5350',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#616161',
    },
  },
  typography: {
    fontFamily: ['Arial', 'sans-serif'].join(','),
    h4: {
      fontWeight: 600,
      color: '#333333',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: '#333333',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#000000',
          },
        },
        containedSecondary: {
          backgroundColor: '#FFE600',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#CCB800',
          },
        },
        outlinedSecondary: {
          borderColor: '#FFE600',
          color: '#333333',
          '&:hover': {
            backgroundColor: 'rgba(255, 230, 0, 0.04)',
            borderColor: '#CCB800',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#2e2e38',
          color: '#fff',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#333333',
          '&:visited': {
            color: '#333333',
          },
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
  },
});

export default eyTheme;
