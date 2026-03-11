import { createContext, useContext, useState } from 'react';
import * as Device from 'expo-device';
import api, { setAuthToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setToken(data.token);
    setAuthToken(data.token);
    setUser(data.user);
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', {
      ...payload,
      deviceId: Device.osInternalBuildId || `${Device.brand}-${Device.modelName}`,
      deviceModel: Device.modelName,
      deviceBrand: Device.brand,
      osVersion: `${Device.osName || 'unknown'} ${Device.osVersion || ''}`
    });
    setToken(data.token);
    setAuthToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
  };

  return <AuthContext.Provider value={{ user, token, login, register, logout, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
