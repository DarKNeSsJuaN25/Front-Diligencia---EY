import {
  Box, Button, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, TextField
} from '@mui/material';
import { Formik, Field, ErrorMessage } from 'formik';
import providerSchema from '../../utils/providerValidationSchema';

const ProviderFormDialog = ({ open, onClose, editingProvider, onSave }) => {
  const initialValues = editingProvider || {
    razonSocial: '',
    nombreComercial: '',
    ruc: '',
    telefono: '',
    correoElectronico: '',
    sitioWeb: '',
    direccion: '',
    pais: '',
    facturacionAnualUSD: '',
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editingProvider ? 'Editar Proveedor' : 'Crear Nuevo Proveedor'}</DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={providerSchema}
        onSubmit={onSave} 
        enableReinitialize={true}
      >
        {({ handleSubmit, isSubmitting, errors, touched }) => (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <DialogContent>
              {/* Campos del formulario */}
              <Field
                as={TextField}
                margin="dense"
                name="razonSocial"
                label="Razón Social"
                fullWidth
                variant="outlined"
                error={touched.razonSocial && !!errors.razonSocial}
                helperText={touched.razonSocial && errors.razonSocial}
              />
              <Field
                as={TextField}
                margin="dense"
                name="nombreComercial"
                label="Nombre Comercial"
                fullWidth
                variant="outlined"
                error={touched.nombreComercial && !!errors.nombreComercial}
                helperText={touched.nombreComercial && errors.nombreComercial}
              />
              <Field
                as={TextField}
                margin="dense"
                name="ruc"
                label="RUC"
                fullWidth
                variant="outlined"
                error={touched.ruc && !!errors.ruc}
                helperText={touched.ruc && errors.ruc}
              />
              <Field
                as={TextField}
                margin="dense"
                name="telefono"
                label="Teléfono"
                fullWidth
                variant="outlined"
                error={touched.telefono && !!errors.telefono} 
                helperText={touched.telefono && errors.telefono} 
              />
              <Field
                as={TextField}
                margin="dense"
                name="correoElectronico"
                label="Correo Electrónico"
                type="email"
                fullWidth
                variant="outlined"
                error={touched.correoElectronico && !!errors.correoElectronico}
                helperText={touched.correoElectronico && errors.correoElectronico}
              />
              <Field
                as={TextField}
                margin="dense"
                name="sitioWeb"
                label="Sitio Web"
                type="url"
                fullWidth
                variant="outlined"
                error={touched.sitioWeb && !!errors.sitioWeb}
                helperText={touched.sitioWeb && errors.sitioWeb}
              />
              <Field
                as={TextField}
                margin="dense"
                name="direccion"
                label="Dirección"
                fullWidth
                variant="outlined"
                error={touched.direccion && !!errors.direccion}
                helperText={touched.direccion && errors.direccion} 
              />
              <Field
                as={TextField}
                margin="dense"
                name="pais"
                label="País"
                fullWidth
                variant="outlined"
                error={touched.pais && !!errors.pais}
                helperText={touched.pais && errors.pais}
              />
              <Field
                as={TextField}
                margin="dense"
                name="facturacionAnualUSD"
                label="Facturación Anual (USD)"
                type="number"
                fullWidth
                variant="outlined"
                inputProps={{ step: "0.01" }}
                error={touched.facturacionAnualUSD && !!errors.facturacionAnualUSD}
                helperText={touched.facturacionAnualUSD && errors.facturacionAnualUSD}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancelar</Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? <CircularProgress size={24} /> : (editingProvider ? 'Guardar Cambios' : 'Crear')}
              </Button>
            </DialogActions>
          </Box>
        )}
      </Formik>
    </Dialog>
  );
};

export default ProviderFormDialog;