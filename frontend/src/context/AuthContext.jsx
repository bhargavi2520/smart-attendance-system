// File: src/context/AuthContext.jsx (Final Fix)

import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [activeRole, _setActiveRole] = useState(
    sessionStorage.getItem("activeRole")
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const setActiveRole = (roleName) => {
    if (roleName) {
      sessionStorage.setItem("activeRole", roleName);
    } else {
      sessionStorage.removeItem("activeRole");
    }
    _setActiveRole(roleName);
  };

  const handleAuth = useCallback(
    async (token) => {
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const response = await api.get("/api/auth/me");
        const userData = response.data;
        setUser(userData);

        if (userData.roles?.length === 1) {
          // --- THIS IS THE FIX ---
          // Convert the role to lowercase to ensure it always matches.
          setActiveRole(userData.roles[0].toLowerCase());
        } else {
          setActiveRole(null);
        }

        navigate("/", { replace: true });
      } catch (error) {
        console.error("Failed to fetch user:", error);
        localStorage.removeItem("token");
        setActiveRole(null);
        setUser(null);
      }
    },
    [navigate]
  );

  // ... the rest of your AuthContext.jsx file remains the same ...

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");

    const initializeAuth = async () => {
      const token = tokenFromUrl || localStorage.getItem("token");
      if (token && !user) {
        await handleAuth(token);
      }
      setLoading(false);
    };

    initializeAuth();
  }, [handleAuth, location.search, user]);

  const login = async (identifier, password, rememberMe) => {
    const response = await api.post("/api/auth/login", {
      identifier,
      password,
      rememberMe,
    });
    const { token } = response.data;
    await handleAuth(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setActiveRole(null);
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeRole,
        setActiveRole,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
