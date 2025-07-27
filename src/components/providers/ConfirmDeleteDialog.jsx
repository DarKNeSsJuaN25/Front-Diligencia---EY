import React from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material';

const ConfirmDeleteDialog = ({ open, onClose, providerName, onConfirm, loading }) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-description">
      <DialogTitle id="confirm-dialog-title">Confirmar Eliminación</DialogTitle>
      <DialogContent>
        <Typography id="confirm-dialog-description">
          ¿Estás seguro de que quieres eliminar al proveedor "{providerName}"? Esta acción no se puede deshacer.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onConfirm} color="error" variant="contained" autoFocus disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Eliminar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;