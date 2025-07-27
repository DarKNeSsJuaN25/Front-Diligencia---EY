import React from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'; // Asegúrate de importar este si no lo tenías ya

const ScreeningResultsDialog = ({ open, onClose, screeningResults }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Resultados de Screening</DialogTitle>
      <DialogContent dividers>
        {screeningResults?.resultados?.length > 0 ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              Registros Encontrados: {screeningResults.hits}
            </Typography>
            {screeningResults.resultados.map((result, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2, borderLeft: '4px solid', borderColor: 'warning.main' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {result['Firm Name'] || 'Nombre de Empresa Desconocido'}
                </Typography>
                {Object.entries(result).map(([key, value]) => (
                  key !== 'Firm Name' && (
                    <Typography key={key} variant="body2">
                      <strong>{key}:</strong> {value}
                    </Typography>
                  )
                ))}
              </Paper>
            ))}
          </Box>
        ) : (
          <Alert severity="info">No se encontraron resultados de riesgo para este proveedor.</Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScreeningResultsDialog;