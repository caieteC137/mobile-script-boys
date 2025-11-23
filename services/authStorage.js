// services/authStorage.js
// Authentication storage service using userStorage

import { validateUserCredentials, setCurrentUser } from './userStorage';

export const validateCredentials = async (email, password) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = await validateUserCredentials(email, password);
    
    if (result.success && result.user) {
      // Set current user after successful login
      await setCurrentUser(result.user);
    }
    
    return result;
  } catch (error) {
    console.error('Error validating credentials:', error);
    return {
      success: false,
      message: 'Erro ao validar credenciais. Tente novamente.'
    };
  }
};

export default {
  validateCredentials
};



