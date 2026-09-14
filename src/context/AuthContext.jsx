import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const DEFAULT_USER = {
  name: 'Anjali',
  email: 'ay8572873559@gmail.com',
  role: 'Aerospace Systems Engineer',
  organization: 'DRDO / MALE UAV Telemetry Command',
  clearanceLevel: 'Level 4 Defense Security',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  isLoggedIn: true,
  preferences: {
    alertSound: true,
    voiceAlert: true,
    darkMode: true,
    emailNotifications: true,
    smsNotifications: false,
    telemetryRefreshRate: 2, // seconds
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(DEFAULT_USER);

  const login = (email, password) => {
    setUser(prev => ({
      ...prev,
      email: email || prev.email,
      name: email && email.includes('ay') ? 'Anjali' : (email ? email.split('@')[0] : 'Anjali'),
      isLoggedIn: true
    }));
    return true;
  };

  const logout = () => {
    setUser(prev => ({ ...prev, isLoggedIn: false }));
  };

  const updateUserProfile = (newFields) => {
    setUser(prev => ({
      ...prev,
      ...newFields,
      preferences: {
        ...prev.preferences,
        ...(newFields.preferences || {})
      }
    }));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
