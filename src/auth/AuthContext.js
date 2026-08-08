import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin } from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

const login = async (username, password) => {
    const { data } = await apiLogin(username, password);
    const userData = {
      _id: data._id,
      name: data.name,
      username: data.username,
      email: data.email,
      role: data.role,
      token: data.token,
    };
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
