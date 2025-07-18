'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DraggedItem {
  type: 'model' | 'background' | 'pose' | 'fashion';
  data: any;
}

interface DragContextType {
  draggedItem: DraggedItem | null;
  setDraggedItem: (item: DraggedItem | null) => void;
}

const DragContext = createContext<DragContextType | undefined>(undefined);

export function DragProvider({ children }: { children: ReactNode }) {
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);

  return (
    <DragContext.Provider value={{ draggedItem, setDraggedItem }}>
      {children}
    </DragContext.Provider>
  );
}

export function useDrag() {
  const context = useContext(DragContext);
  if (context === undefined) {
    throw new Error('useDrag must be used within a DragProvider');
  }
  return context;
}