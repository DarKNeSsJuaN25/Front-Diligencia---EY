// src/utils/providerValidationSchema.js
import * as Yup from 'yup';

const providerSchema = Yup.object().shape({
  razonSocial: Yup.string()
    .required('La Razón Social es obligatoria.')
    .min(3, 'La Razón Social debe tener al menos 3 caracteres.')
    .max(255, 'La Razón Social no puede exceder los 255 caracteres.'),
  nombreComercial: Yup.string()
    .required('El Nombre Comercial es obligatorio.')
    .min(3, 'El Nombre Comercial debe tener al menos 3 caracteres.')
    .max(255, 'El Nombre Comercial no puede exceder los 255 caracteres.'),
  ruc: Yup.string()
    .required('El RUC es obligatorio.')
    .matches(/^\d{11}$/, 'El RUC debe tener exactamente 11 dígitos numéricos.'),
  telefono: Yup.string()
    .required('El Teléfono es obligatorio.')
    .matches(/^[0-9+() -]+$/, 'El Teléfono solo puede contener números, espacios, guiones, paréntesis y el signo +.')
    .min(7, 'El Teléfono debe tener al menos 7 dígitos.')
    .max(20, 'El Teléfono no puede exceder los 20 caracteres.'),
  correoElectronico: Yup.string()
    .email('Ingrese un correo electrónico válido.')
    .required('El Correo Electrónico es obligatorio.')
    .max(255, 'El Correo Electrónico no puede exceder los 255 caracteres.'),
  sitioWeb: Yup.string()
    .url('Ingrese una URL válida para el Sitio Web (ej. https://www.ejemplo.com).')
    .required('El Sitio Web es obligatorio.') // Ahora requerido en frontend, igual que en backend
    .max(255, 'El Sitio Web no puede exceder los 255 caracteres.'),
  direccion: Yup.string()
    .required('La Dirección es obligatoria.') // Ahora requerido en frontend, igual que en backend
    .min(5, 'La Dirección debe tener al menos 5 caracteres.')
    .max(255, 'La Dirección no puede exceder los 255 caracteres.'), // Sincronizado con backend (255)
  pais: Yup.string()
    .required('El País es obligatorio.') // Ahora requerido en frontend, igual que en backend
    .min(2, 'El País debe tener al menos 2 caracteres.')
    .max(100, 'El País no puede exceder los 100 caracteres.'),
  facturacionAnualUSD: Yup.number()
    .required('La Facturación Anual (USD) es obligatoria.') // Ahora requerido en frontend, igual que en backend
    .typeError('Ingrese un número válido para la Facturación Anual.')
    .positive('La Facturación Anual debe ser un número positivo.')
    .max(999999999999, 'La Facturación Anual es demasiado grande para ser procesada.')
    // Este test adicional ayuda a asegurar que los inputs de tipo number que pueden devolver '' si están vacíos sean tratados como error por 'required'
    .test(
      'is-not-empty-string',
      'La Facturación Anual (USD) es obligatoria.',
      value => value !== null && value !== undefined && value !== ''
    ),
});

export default providerSchema;