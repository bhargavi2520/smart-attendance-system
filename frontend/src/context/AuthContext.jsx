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
        const response = await api.get("/auth/me");
        const userData = response.data;
        setUser(userData);

        // If user has only one role, automatically set it as active.
        // Otherwise, clear any previously active role to force selection.
        if (userData.roles?.length === 1) {
          setActiveRole(userData.roles[0].name);
        } else {
          setActiveRole(null);
        }

        // Redirect to dashboard, removing the token from the URL
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

  useEffect(() => {
    // Check for token from Google Redirect in URL
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      handleAuth(tokenFromUrl);
    } else {
      // Check for token from localStorage
      const tokenFromStorage = localStorage.getItem("token");
      if (tokenFromStorage && !user) {
        handleAuth(tokenFromStorage);
      }
    }
    setLoading(false);
  }, [handleAuth, location.search, user]);

  const login = async (identifier, password, rememberMe) => {
    const response = await api.post("/auth/login", {
      identifier,
      password,
      rememberMe,
    });
    const { token } = response.data;
    // handleAuth will fetch user and set roles
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
