import { API_BASE_URL } from '../config/apiConfig';
import { getToken } from './authService';

const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

const getProviders = async (pageNumber = 1, pageSize = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Proveedores?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.title || errorData.message || 'Error al obtener proveedores');
    }
    return response.json();
  } catch (error) {
    console.error('Error en getProviders:', error);
    throw error;
  }
};

const getProviderByRazonSocial = async (razonSocial) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Proveedores/name?razonSocial=${encodeURIComponent(razonSocial)}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (response.status === 404) {
        return null; 
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      let errorMessage = errorData.title || errorData.message || 'Error al buscar proveedor por razón social';
      if (errorData.errors) {
          const validationErrors = Object.values(errorData.errors).flat();
          if (validationErrors.length > 0) {
              errorMessage = validationErrors.join(', ');
          }
      }
      throw new Error(errorMessage);
    }
    return response.json();
  } catch (error) {
    console.error('Error en getProviderByRazonSocial:', error);
    throw error;
  }
};

const createProvider = async (providerData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Proveedores`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(providerData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      let errorMessage = errorData.title || errorData.message || 'Error al crear proveedor';
      if (errorData.errors) {
          const validationErrors = Object.values(errorData.errors).flat();
          if (validationErrors.length > 0) {
              errorMessage = validationErrors.join(', ');
          }
      }
      throw new Error(errorMessage);
    }
    return response.json();
  } catch (error) {
    console.error('Error en createProvider:', error);
    throw error;
  }
};

const updateProvider = async (id, providerData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Proveedores/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(providerData),
    });

    if (response.status === 204) {
        console.log(`Proveedor con ID ${id} actualizado exitosamente (204 No Content).`);
        return {};
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      let errorMessage = errorData.title || errorData.message || 'Error al actualizar proveedor';
      if (errorData.errors) {
          const validationErrors = Object.values(errorData.errors).flat();
          if (validationErrors.length > 0) {
              errorMessage = validationErrors.join(', ');
          }
      }
      throw new Error(errorMessage);
    }
    return response.json(); 
  } catch (error) {
    console.error('Error en updateProvider:', error);
    throw error;
  }
};

const deleteProvider = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Proveedores/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.title || errorData.message || 'Error al eliminar proveedor');
    }
    return true;
  } catch (error) {
    console.error('Error en deleteProvider:', error);
    throw error;
  }
};

const performScreening = async (providerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Proveedores/${providerId}/screening`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({})
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      let errorMessage = errorData.title || errorData.message || 'Error al realizar el screening';
      if (errorData.errors) {
          const validationErrors = Object.values(errorData.errors).flat();
          if (validationErrors.length > 0) {
              errorMessage = validationErrors.join(', ');
          }
      }
      throw new Error(errorMessage);
    }
    return response.json();
  } catch (error) {
    console.error('Error en performScreening:', error);
    throw error;
  }
};

export { getProviders, createProvider, updateProvider, deleteProvider, performScreening, getProviderByRazonSocial };