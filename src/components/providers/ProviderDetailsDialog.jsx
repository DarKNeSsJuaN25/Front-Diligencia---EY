import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Link
} from '@mui/material';

const ProviderDetailsDialog = ({ open, onClose, provider }) => {
  if (!provider) return null;

  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch {
      return isoString;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Detalles del Proveedor: {provider.razonSocial}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>Información General</Typography>
          <Typography variant="body1"><strong>ID:</strong> {provider.id}</Typography>
          <Typography variant="body1"><strong>Razón Social:</strong> {provider.razonSocial || 'N/A'}</Typography>
          <Typography variant="body1"><strong>Nombre Comercial:</strong> {provider.nombreComercial || 'N/A'}</Typography>
          <Typography variant="body1"><strong>RUC:</strong> {provider.ruc || 'N/A'}</Typography>
          <Typography variant="body1"><strong>País:</strong> {provider.pais || 'N/A'}</Typography>
          <Typography variant="body1"><strong>Dirección:</strong> {provider.direccion || 'N/A'}</Typography>
          <Typography variant="body1"><strong>Teléfono:</strong> {provider.telefono || 'N/A'}</Typography>
          <Typography variant="body1"><strong>Correo Electrónico:</strong> {provider.correoElectronico || 'N/A'}</Typography>
          <Typography variant="body1">
            <strong>Sitio Web:</strong>{' '}
            {provider.sitioWeb ? (
                <Link
                href={provider.sitioWeb.startsWith('http://') || provider.sitioWeb.startsWith('https://')
                    ? provider.sitioWeb
                    : `https://${provider.sitioWeb}`}
                target="_blank"
                rel="noopener noreferrer"
                >
                {provider.sitioWeb}
                </Link>
            ) : (
                'N/A'
            )}
            </Typography>
          <Typography variant="body1">
            <strong>Facturación Anual (USD):</strong> {provider.facturacionAnualUSD
              ? provider.facturacionAnualUSD.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD'
                })
              : 'N/A'}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="h6" gutterBottom>Fechas</Typography>
          <Typography variant="body1"><strong>Fecha de Creación:</strong> {formatDateTime(provider.fechaCreacion)}</Typography>
          <Typography variant="body1"><strong>Última Actualización:</strong> {formatDateTime(provider.fechaActualizacion)}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProviderDetailsDialog;
