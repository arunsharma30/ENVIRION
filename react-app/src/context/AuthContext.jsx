import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../services/backend';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('envirion_token'));
  const [loading, setLoading] = useState(true);

  // Hydrate user from stored token on mount
  useEffect(() => {
    if (token) {
      getMe(token)
        .then(data => {
          setUser(data.user);
          setLoading(false);
        })
        .catch(() => {
          // Token invalid/expired — clear
          localStorage.removeItem('envirion_token');
          setToken(null);
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (newToken, userData) => {
    localStorage.setItem('envirion_token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const signup = (newToken, userData) => {
    localStorage.setItem('envirion_token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('envirion_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
