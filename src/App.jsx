import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import ProviderListPage from './pages/Providers/ProviderListPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import SharedLayout from './components/SharedLayout/SharedLayout';
import eyTheme from './theme/eyTheme';
import { ThemeProvider } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          width: '100vw'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider theme={eyTheme}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<PrivateRoute><SharedLayout /></PrivateRoute>}>
              <Route index element={<ProviderListPage />} />
              <Route path="/providers" element={<ProviderListPage />} />
            </Route>
            <Route path="*" element={<div>404 - Página no encontrada</div>} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
