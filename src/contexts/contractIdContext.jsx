"use client";

import React, { createContext, useContext } from "react";

const contractIdContext = createContext();

export function contractIdContextProvider({ children, value }) {
  return (
    <contractIdContext.Provider value={value}>
      {children}
    </contractIdContext.Provider>
  );
}

export function useContractIdContext() {
  return useContext(contractIdContext);
}
