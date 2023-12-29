import React, { createContext, useState, useContext } from 'react';

type UserContextType = {
  refetchUser: boolean;
  refetchData: boolean; // add
  setRefetchUser: React.Dispatch<React.SetStateAction<boolean>>;
  setRefetchData: React.Dispatch<React.SetStateAction<boolean>>; // add
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [refetchUser, setRefetchUser] = useState(false);
  const [refetchData, setRefetchData] = useState(false); // add

  return (
    <UserContext.Provider value={{ refetchUser, setRefetchUser, refetchData, setRefetchData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("useUser must be used within a UserProvider");
  return context;
}