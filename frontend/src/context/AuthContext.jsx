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
      setActiveRole(null);
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const response = await api.get("/api/auth/me");
        const { user: userData } = response.data;

        setUser(userData);

        // This new logic navigates only ONCE to the correct page
        if (userData.roles?.length > 1) {
          // If more than one role, go to the selection page.
          navigate("/select-role", { replace: true });
        } else {
          // Otherwise, set the single role and go to the dashboard.
          if (userData.roles?.length === 1) {
            setActiveRole(userData.roles[0]);
          }
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        localStorage.removeItem("token");
        setActiveRole(null);
        setUser(null);
        navigate("/login", { replace: true });
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
