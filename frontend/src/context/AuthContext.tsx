import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setUser(JSON.parse(userData));
      // Optionnel : vérifier la validité du token avec le backend
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/utilisateurs/login', {
        email,
        mot_de_passe: password,
      });

      const { token, utilisateur } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(utilisateur));
      setUser(utilisateur);

      console.log(utilisateur.type)
      if (utilisateur.type === 'Administrateur') {
        window.location.href = '/admin/';
      } else if (utilisateur.type === 'Proprietaire') {
        window.location.href = '/owner/';
      } else if (utilisateur.type === 'Client') {
        window.location.href = '/';
      } else {
        window.location.href = '/';
      }

      return utilisateur;
    } catch (error) {
      console.log(error)
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
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