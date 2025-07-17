// src/contexts/OverlayContext

import { createContext, useContext, useState } from 'react';

export const OverlayContext = createContext();

export const OverlayProvider = ({ children }) => {
  const [msg, setMsg] = useState(null);
  const [popUpAuthn, setPopUpAuthn] = useState(null); // 'to-login', 'to-register'

  return (
    <OverlayContext.Provider value={{ msg, setMsg, popUpAuthn, setPopUpAuthn }}>
      {children}
    </OverlayContext.Provider>
  );
};

export default function useOverlay() {
  const context = useContext(OverlayContext);
  if (!context) throw new Error("useOverlay must be used within a OverlayProvider");
  return context;
}
