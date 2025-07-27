import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, TableContainer,
  Table, TableHead, TableRow, TableCell, TableBody,
  TablePagination, CircularProgress, Alert, TextField,
  Dialog, DialogContent, DialogTitle
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';

import {
  getProviders,
  createProvider,
  updateProvider,
  deleteProvider,
  performScreening,
  getProviderByRazonSocial
} from '../../services/providerService';
import { useAuth } from '../../context/AuthContext';
import ConfirmDeleteDialog from '../../components/providers/ConfirmDeleteDialog';
import ScreeningResultsDialog from '../../components/providers/ScreeningResultsDialog';
import ProviderFormDialog from '../../components/providers/ProviderFormDialog';
import ProviderDetailsDialog from '../../components/providers/ProviderDetailsDialog';
import SnackbarAlert from '../../components/common/SnackbarAlert';

const ProviderListPage = () => {
  const { user } = useAuth();
  const [providers, setProviders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState(null);
  const [screeningResults, setScreeningResults] = useState(null);
  const [openScreeningDialog, setOpenScreeningDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const isAdmin = user?.roles && user.roles.includes('Admin');

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedProviderDetails, setSelectedProviderDetails] = useState(null);
  const [openScreeningLoadingDialog, setOpenScreeningLoadingDialog] = useState(false);

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const fetchProviders = async (pageNumber, pageSize) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProviders(pageNumber + 1, pageSize);
      setProviders(data.items);
      setTotalCount(data.totalCount);
      setSearchResults(null);
      setIsSearching(false);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los proveedores.");
      showSnackbar(err.message || "Error al cargar proveedores.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchProviders(page, rowsPerPage);
      return;
    }

    setLoading(true);
    setError(null);
    setIsSearching(true);
    setProviders([]);

    try {
      const foundProvider = await getProviderByRazonSocial(searchTerm);
      if (foundProvider) {
        setSearchResults(foundProvider);
        showSnackbar(`Proveedor '${searchTerm}' encontrado.`, 'success');
      } else {
        setSearchResults(null);
        showSnackbar(`Proveedor con Razón Social '${searchTerm}' no encontrado.`, 'info');
      }
    } catch (err) {
      setError(err.message || "Error al buscar el proveedor.");
      showSnackbar(err.message || "Error al buscar el proveedor.", "error");
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    fetchProviders(page, rowsPerPage);
  };

  const handleReloadTable = () => {
    if (isSearching) {
      handleClearSearch();
    } else {
      fetchProviders(page, rowsPerPage);
    }
    showSnackbar('Tabla de proveedores actualizada.', 'info');
  };

  useEffect(() => {
    if (!isSearching) {
      fetchProviders(page, rowsPerPage);
    }
  }, [page, rowsPerPage, isSearching]);

  const handleOpenCreateDialog = () => {
    setEditingProvider(null);
    setOpenFormDialog(true);
  };

  const handleOpenEditDialog = (provider) => {
    setEditingProvider(provider);
    setOpenFormDialog(true);
  };

  const handleCloseFormDialog = () => {
    setOpenFormDialog(false);
    setEditingProvider(null);
  };

  const handleOpenDetailsDialog = (provider) => {
    setSelectedProviderDetails(provider);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedProviderDetails(null);
  };

  const handleSaveProvider = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    try {
      if (editingProvider) {
        await updateProvider(editingProvider.id, values);
        showSnackbar('Proveedor actualizado exitosamente!', 'success');
      } else {
        await createProvider(values);
        showSnackbar('Proveedor creado exitosamente!', 'success');
        resetForm();
      }
      handleCloseFormDialog();
      if (isSearching && searchResults?.id === values.id) {
        setSearchResults(values);
      } else {
        fetchProviders(page, rowsPerPage);
      }
    } catch (err) {
      showSnackbar(err.message || "Error al guardar el proveedor.", 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenConfirmDelete = (provider) => {
    setProviderToDelete(provider);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDelete = () => {
    setOpenConfirmDialog(false);
    setProviderToDelete(null);
  };

  const handleDeleteProvider = async () => {
    if (!providerToDelete) return;
    setLoading(true);
    try {
      await deleteProvider(providerToDelete.id);
      showSnackbar('Proveedor eliminado exitosamente!', 'success');
      handleCloseConfirmDelete();
      fetchProviders(page, rowsPerPage);
    } catch (err) {
      showSnackbar(err.message || "Error al eliminar el proveedor.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePerformScreening = async (providerId) => {
    if (!user?.roles?.includes('Admin')) {
      showSnackbar("No tienes permisos de administrador para realizar el screening.", "warning");
      return;
    }

    setOpenScreeningLoadingDialog(true);
    setError(null);
    try {
      const results = await performScreening(providerId);
      setScreeningResults(results);
      setOpenScreeningDialog(true);
      showSnackbar('Screening realizado exitosamente.', 'success');
    } catch (err) {
      setError(err.message || "Error al realizar el screening.");
      showSnackbar(err.message || "Error al realizar el screening.", 'error');
    } finally {
      setOpenScreeningLoadingDialog(false);
    }
  };

  const handleCloseScreeningDialog = () => {
    setOpenScreeningDialog(false);
    setScreeningResults(null);
  };

  const providersToDisplay = isSearching ? (searchResults ? [searchResults] : []) : providers;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Proveedores
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField
          label="Buscar por Razón Social"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
          sx={{ width: '400px', mr: 2 }}
          disabled={loading || openScreeningLoadingDialog}
        />
        <Button
          variant="outlined"
          startIcon={<SearchIcon />}
          onClick={handleSearch}
          sx={{ mr: 2 }}
          disabled={loading || openScreeningLoadingDialog}
        >
          Buscar
        </Button>
        {isSearching && (
          <Button
            variant="outlined"
            onClick={handleClearSearch}
            color="error"
            sx={{ mr: 2 }}
            disabled={loading || openScreeningLoadingDialog}
          >
            Limpiar Búsqueda
          </Button>
        )}
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleReloadTable}
          color="info"
          sx={{ mr: 2 }}
          disabled={loading || openScreeningLoadingDialog}
        >
          Recargar
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
          disabled={loading || openScreeningLoadingDialog}
        >
          Crear Proveedor
        </Button>
      </Box>

      {loading && !openScreeningLoadingDialog ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper>
          <TableContainer>
            <Table aria-label="proveedores table">
              <TableHead>
                <TableRow>
                  <TableCell>Razón Social</TableCell>
                  <TableCell>Nombre Comercial</TableCell>
                  <TableCell>RUC</TableCell>
                  <TableCell>País</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {providersToDisplay.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      {isSearching
                        ? "No se encontró ningún proveedor con esa razón social."
                        : "No hay proveedores registrados."}
                    </TableCell>
                  </TableRow>
                ) : (
                  providersToDisplay.map((proveedor) => (
                    <TableRow key={proveedor.id}>
                      <TableCell>{proveedor.razonSocial}</TableCell>
                      <TableCell>{proveedor.nombreComercial}</TableCell>
                      <TableCell>{proveedor.ruc}</TableCell>
                      <TableCell>{proveedor.pais}</TableCell>
                      <TableCell align="right">
                        <Button
                          startIcon={<VisibilityIcon />}
                          size="small"
                          onClick={() => handleOpenDetailsDialog(proveedor)}
                          sx={{ mr: 1 }}
                          disabled={openScreeningLoadingDialog}
                        >
                          Ver Más
                        </Button>
                        <Button
                          startIcon={<EditIcon />}
                          size="small"
                          onClick={() => handleOpenEditDialog(proveedor)}
                          sx={{ mr: 1 }}
                          disabled={openScreeningLoadingDialog}
                        >
                          Editar
                        </Button>
                        <Button
                          startIcon={<DeleteIcon />}
                          size="small"
                          color="error"
                          onClick={() => handleOpenConfirmDelete(proveedor)}
                          sx={{ mr: 1 }}
                          disabled={!isAdmin || openScreeningLoadingDialog}
                          title={isAdmin ? "Eliminar Proveedor" : "Solo administradores pueden eliminar proveedores"}
                        >
                          Eliminar
                        </Button>
                        <Button
                          startIcon={<SearchIcon />}
                          size="small"
                          variant="outlined"
                          onClick={() => handlePerformScreening(proveedor.id)}
                          disabled={!isAdmin || openScreeningLoadingDialog}
                        >
                          Screening
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {!isSearching && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por página:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
          )}
        </Paper>
      )}

      <ConfirmDeleteDialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDelete}
        providerName={providerToDelete?.razonSocial}
        loading={loading}
        onConfirm={handleDeleteProvider}
      />

      <ScreeningResultsDialog
        open={openScreeningDialog}
        onClose={handleCloseScreeningDialog}
        screeningResults={screeningResults}
      />

      <ProviderFormDialog
        open={openFormDialog}
        onClose={handleCloseFormDialog}
        editingProvider={editingProvider}
        onSave={handleSaveProvider}
      />

      <ProviderDetailsDialog
        open={openDetailsDialog}
        onClose={handleCloseDetailsDialog}
        provider={selectedProviderDetails}
      />

      <SnackbarAlert
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleCloseSnackbar}
      />

      <Dialog
        open={openScreeningLoadingDialog}
        aria-labelledby="loading-dialog-title"
        disableEscapeKeyDown
      >
        <DialogTitle id="loading-dialog-title" sx={{ textAlign: 'center' }}>
          Realizando Screening...
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', p: 4 }}>
          <CircularProgress size={60} />
          <Typography sx={{ mt: 2 }}>Por favor, espere mientras verificamos al proveedor.</Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProviderListPage;
