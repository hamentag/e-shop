// src/hooks/useOverlay.js

import { useContext } from 'react';
import { OverlayContext } from '../contexts/OverlayContext';

export default function useOverlay() {
  const context = useContext(OverlayContext);
  if (!context) throw new Error("useOverlay must be used inside OverlayProvider");
  return context;
}
