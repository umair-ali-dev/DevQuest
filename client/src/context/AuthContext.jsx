import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session when application loads.
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch (error) {
        console.error("Session check failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Register.
  const register = async (userData) => {
    const response = await api.post("/auth/register", userData);

    setUser(response.data.user);

    return response.data;
  };

  // Login.
  const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);

    setUser(response.data.user);

    return response.data;
  };

  // Update logged-in user information.
  const updateUser = (updatedUser) => {
    setUser((previousUser) => ({
      ...previousUser,
      ...updatedUser,
    }));
  };

  // Logout.
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    register,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// The provider and its associated hook intentionally share this context module.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
