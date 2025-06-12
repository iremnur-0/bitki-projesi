import React, { createContext, useState } from "react";

export const MainContext = createContext();

export const MainProvider = ({ children }) => {
  const [nickname, setNickname] = useState("");
  const [userType, setUserType] = useState("");

  return (
    <MainContext.Provider
      value={{ nickname, setNickname, userType, setUserType }}
    >
      {children}
    </MainContext.Provider>
  );
};
