import React from 'react';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const SnackbarAlert = ({ open, message, severity, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <MuiAlert
        onClose={onClose}
        severity={severity}
        elevation={6}
        variant="filled"
      >
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default SnackbarAlert;