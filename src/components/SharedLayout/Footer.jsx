import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2, textAlign: 'center', mt: 'auto' }}>
      <Typography variant="body2">
        © {new Date().getFullYear()} Diligencia Proveedores. Todos los derechos reservados.
      </Typography>
    </Box>
  );
};

export default Footer;