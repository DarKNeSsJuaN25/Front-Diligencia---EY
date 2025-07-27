import React, { use } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };
  const getUsernameFromEmail = (email) => {
    if (!email) return '';
    const atIndex = email.indexOf('@');
    if (atIndex > -1) {
      return email.substring(0, atIndex);
    }
    return email; 
  };

  const getUserRolesDisplay = (roles) => {
    if (!roles || roles.length === 0) return '';
    if (roles.includes('Admin')) {
    return 'Admin';
  }
    return roles.join(', ');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <img src="/ey_logo.svg" alt="EY Logo" style={{ height: 55 }} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Typography variant="body1" sx={{ mr: 2 }}>
                Bienvenido, {getUsernameFromEmail(user?.email)} ({getUserRolesDisplay(user?.roles)})
              </Typography>
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{
                  position: 'relative',
                  '&:hover::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: '3px',
                    width: '100%',
                    backgroundColor: '#FFE600',
                  },
                }}
              >
                Cerrar Sesión
              </Button>

            </>
          ) : (
            <Button color="inherit" onClick={handleLoginRedirect}>
              Iniciar Sesión
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;