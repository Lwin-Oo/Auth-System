// AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [ userId, setUserId ] = useState(null);

    // Set userId after user logged In
    const login = (userId) => {
        setUserId(userId);
    };

    return (
        <AuthContext.Provider value={{ userId, login }}>
          {children}
        </AuthContext.Provider>
      );
}