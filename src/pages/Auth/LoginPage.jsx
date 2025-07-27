import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authLogin(email, password);
    } catch (err) {
      setError(err.message || 'Ocurrió un error inesperado. Por favor, inténtelo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100vw',
        bgcolor: 'primary.main',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4,
          boxShadow: 6,
          borderRadius: 2,
          bgcolor: 'background.paper',
          maxWidth: 400,
          minHeight: 450,
          width: '100%',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            color: 'primary.main',
            textAlign: 'center',
            mb: 3,
          }}
        >
          Centro de Diligencia de Proveedores
        </Typography>

        <Box sx={{ flexGrow: 1, mb: 2 }}>
          <img src="/ey_login.png" alt="EY Logo" style={{ height: 80 }} />
        </Box>

        <Typography
          component="h1"
          variant="h5"
          sx={{ color: 'primary.main', fontWeight: 300 }}
        >
          Iniciar Sesión
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo electrónico"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              mt: 3,
              mb: 2,
              fontWeight: 'bold',
              color: 'primary.contrastText',
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Acceder'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;
