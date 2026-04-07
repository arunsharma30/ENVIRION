import { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate user from Supabase session on mount
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const meta = session.user.user_metadata || {};
        setToken(session.access_token);
        setUser({
          id: session.user.id,
          name: meta.name || '',
          email: session.user.email,
          region: meta.region || ''
        });
      }
      setLoading(false);
    });

    // Listen for auth state changes (token refresh, sign-out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          const meta = session.user.user_metadata || {};
          setToken(session.access_token);
          setUser({
            id: session.user.id,
            name: meta.name || '',
            email: session.user.email,
            region: meta.region || ''
          });
        } else {
          setToken(null);
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
  };

  const signup = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
  };

  const logout = async () => {
    await supabase.auth.signOut();
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
