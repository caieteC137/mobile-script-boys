// services/userStorage.js
// Local user storage service that simulates a JSON database using AsyncStorage

import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_STORAGE_KEY = '@users_data';
const CURRENT_USER_KEY = '@current_user';

// Initialize users storage with default data if it doesn't exist
const initializeUsers = async () => {
  try {
    const existingUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    if (!existingUsers) {
      // Initialize with the default admin user
      const defaultUsers = {
        users: [
          {
            id: '1',
            name: 'Admin',
            email: 'admin@museum.com',
            password: 'museum123',
            createdAt: new Date().toISOString(),
            profileImage: null
          }
        ]
      };
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    return JSON.parse(existingUsers);
  } catch (error) {
    console.error('Error initializing users:', error);
    throw error;
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const usersData = await initializeUsers();
    return usersData.users || [];
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
};

// Get user by email
export const getUserByEmail = async (email) => {
  try {
    const users = await getAllUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
};

// Get user by ID
export const getUserById = async (id) => {
  try {
    const users = await getAllUsers();
    return users.find(user => user.id === id);
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
};

// Create a new user
export const createUser = async (userData) => {
  try {
    const { name, email, password } = userData;
    
    // Validate required fields
    if (!name || !email || !password) {
      return {
        success: false,
        message: 'Todos os campos são obrigatórios'
      };
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return {
        success: false,
        message: 'Este e-mail já está cadastrado'
      };
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      return {
        success: false,
        message: 'E-mail inválido'
      };
    }

    // Validate password length
    if (password.length < 6) {
      return {
        success: false,
        message: 'A senha deve ter pelo menos 6 caracteres'
      };
    }

    // Get existing users
    const usersData = await initializeUsers();
    const users = usersData.users || [];

    // Create new user
    const newUser = {
      id: String(Date.now()), // Simple ID generation
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password, // In a real app, this should be hashed
      createdAt: new Date().toISOString(),
      profileImage: null
    };

    // Add new user
    users.push(newUser);

    // Save updated users
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify({ users }));

    return {
      success: true,
      message: 'Usuário cadastrado com sucesso!',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        profileImage: newUser.profileImage
      }
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      success: false,
      message: 'Erro ao cadastrar usuário. Tente novamente.'
    };
  }
};

// Validate user credentials
export const validateUserCredentials = async (email, password) => {
  try {
    const user = await getUserByEmail(email);
    
    if (!user) {
      return {
        success: false,
        message: 'E-mail ou senha inválidos'
      };
    }

    if (user.password !== password) {
      return {
        success: false,
        message: 'E-mail ou senha inválidos'
      };
    }

    return {
      success: true,
      message: 'Login realizado com sucesso!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage
      }
    };
  } catch (error) {
    console.error('Error validating credentials:', error);
    return {
      success: false,
      message: 'Erro ao validar credenciais. Tente novamente.'
    };
  }
};

// Set current logged-in user
export const setCurrentUser = async (user) => {
  try {
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error setting current user:', error);
  }
};

// Get current logged-in user
export const getCurrentUser = async () => {
  try {
    const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Clear current user (logout)
export const clearCurrentUser = async () => {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  } catch (error) {
    console.error('Error clearing current user:', error);
  }
};

export const updateUserProfileImage = async (userId, imageUri) => {
  try {
    const data = await initializeUsers();
    const users = data.users;

    const index = users.findIndex(u => u.id === userId);

    if (index === -1) return;

    users[index].profileImage = imageUri;

    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify({ users }));

    // também atualiza o usuário logado, se for o mesmo
    const currentUser = await getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      currentUser.profileImage = imageUri;
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    }
  } catch (error) {
    console.error('Error updating profile image:', error);
  }
};

// Export users data as JSON (for debugging/backup)
export const exportUsersJSON = async () => {
  try {
    const usersData = await initializeUsers();
    return JSON.stringify(usersData, null, 2);
  } catch (error) {
    console.error('Error exporting users JSON:', error);
    return null;
  }
};

export default {
  getAllUsers,
  getUserByEmail,
  getUserById,
  createUser,
  validateUserCredentials,
  setCurrentUser,
  getCurrentUser,
  clearCurrentUser,
  updateUserProfileImage,
  exportUsersJSON
};

