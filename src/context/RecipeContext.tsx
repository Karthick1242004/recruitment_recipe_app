import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';

interface RecipeContextType {
  globalSettings: { theme: string };
  updateGlobalSettings: (settings: any) => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [globalSettings, setGlobalSettings] = useState({ theme: 'light' });

  const updateGlobalSettings = useCallback((newSettings: any) => {
    setGlobalSettings(prev => ({ ...prev, ...newSettings }));
    console.log('Attempting to update global settings...', newSettings);
  }, []);

  const memoizedValue = useMemo(
    () => ({
      globalSettings,
      updateGlobalSettings,
    }),
    [globalSettings, updateGlobalSettings]
  );

  return (
    <RecipeContext.Provider value={memoizedValue}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipeContext = () => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipeContext must be used within a RecipeProvider');
  }
  return context;
};
