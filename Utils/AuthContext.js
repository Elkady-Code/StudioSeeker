import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);

  const login = (token) => {
    setUserToken(token);
  };

  const signOut = () => {
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, login, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
