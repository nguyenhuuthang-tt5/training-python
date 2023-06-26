import { createContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ACCOUNTS } from "../config";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  const login = (data) => {
    if (ACCOUNTS.admin.username === data.username && ACCOUNTS.admin.password === data.password) {
      setUser(ACCOUNTS.admin);
    }
    if (ACCOUNTS.user.username === data.username && ACCOUNTS.user.password === data.password) {
      setUser(ACCOUNTS.user);
    }
    
    
    navigate("/dashboard");
  };

  const logout = () => {
    setUser(null);
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login, 
      logout
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
