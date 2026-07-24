import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    const name  = localStorage.getItem('name');
    return token ? { token, name } : null;
  });

  const login = (token, name) => {
    localStorage.setItem('token', token);
    localStorage.setItem('name', name);
    setAuth({ token, name });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
