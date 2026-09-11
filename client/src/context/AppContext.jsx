import React, { useState, createContext, useContext, useEffect } from 'react';
import axios from 'axios'; // 1. Import axios

// Create the context
export const AppContext = createContext();

// Create a custom hook for easy access
export const useAppContext = () => {
  return useContext(AppContext);
};

// 2. Helper function: Sets the auth token for all future axios requests
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Create the Provider component
export const AppProvider = ({ children }) => {
  // 3. Initialize state from localStorage
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null); // Replaces 'auth'
  const [modal, setModal] = useState({ message: '', type: 'error' });

  // 4. This effect runs when the app loads or when 'token' changes
  useEffect(() => {
    if (token) {
      // Token exists, save it to localStorage & set axios header
      localStorage.setItem('token', token);
      setAuthToken(token);
    } else {
      // No token, clear localStorage & axios header
      localStorage.removeItem('token');
      setAuthToken(null);
    }
  }, [token]);

  // 5. This effect runs ONCE when the app first loads
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          // If we have a token, get the user's profile
          const { data } = await axios.get('https://hackathon-backend1-akuo.onrender.com/api/auth/profile');
          setUser(data); // Save the user data
        } catch (error) {
          // If token is invalid, log them out
          logout();
        }
      }
    };
    loadUser();
  }, [token]); // We re-run this if the token changes

  // --- Auth Functions ---
  
  // 6. (REPLACED) 'login' now saves the token and user data
  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
  };
  
  // 'adminLogin' is no longer needed, the main 'login' handles it.
  // We'll keep it so your LoginPage.jsx doesn't break.
  const adminLogin = (token, userData) => {
    login(token, userData);
  };

  // 7. (REPLACED) 'logout' now clears the token and user
  const logout = () => {
    setToken(null);
    setUser(null);
  };
  
  // --- Modal Functions (Unchanged) ---
  const showModal = (message, type = 'error') => {
    setModal({ message, type });
  };

  const closeModal = () => {
    setModal({ message: '', type: 'error' });
  };

  // 8. Update the values shared with the app
  const value = {
    token,  // Share the token
    user,   // Share the user object
    isAdmin: user?.role === 'admin', // Share if user is admin
    isLoggedIn: !!user, // Share if user is logged in
    login,
    adminLogin,
    logout,
    modal,
    showModal,
    closeModal,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};