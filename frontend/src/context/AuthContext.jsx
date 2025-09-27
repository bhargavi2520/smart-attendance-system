import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuth = useCallback(
    async (token) => {
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
        // Redirect to dashboard, removing the token from the URL
        navigate("/", { replace: true });
      } catch (error) {
        console.error("Failed to fetch user:", error);
        localStorage.removeItem("token");
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
      if (tokenFromStorage) {
        handleAuth(tokenFromStorage);
      }
    }
    setLoading(false);
  }, [handleAuth, location.search]);

  const login = async (identifier, password, rememberMe) => {
    const response = await api.post("/auth/login", {
      identifier,
      password,
      rememberMe,
    });
    const { token, ...userData } = response.data;
    handleAuth(token);
    setUser(userData); // Set user immediately for faster UI update
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
