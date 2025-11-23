// services/authStorage.js
// Mock authentication storage for temporary credential validation

const mockCredentials = {
  email: 'admin@museum.com',
  password: 'museum123'
};

export const validateCredentials = (email, password) => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      const isValid = email === mockCredentials.email && password === mockCredentials.password;
      resolve({
        success: isValid,
        message: isValid ? 'Login realizado com sucesso!' : 'E-mail ou senha inválidos'
      });
    }, 1000);
  });
};

export default {
  validateCredentials
};



