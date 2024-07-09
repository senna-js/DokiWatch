import React, { createContext, useContext, useState, ReactNode } from "react";

interface AnimeContextType {
  triggerFetch: boolean;
  setTriggerFetch: React.Dispatch<React.SetStateAction<boolean>>;
}

const AnimeContext = createContext<AnimeContextType | undefined>(undefined);

export const AnimeProvider = ({ children }: { children: ReactNode }) => {
  const [triggerFetch, setTriggerFetch] = useState(false);

  return (
    <AnimeContext.Provider value={{ triggerFetch, setTriggerFetch }}>
      {children}
    </AnimeContext.Provider>
  );
};

export const useAnimeContext = () => {
  const context = useContext(AnimeContext);
  if (context === undefined) {
    throw new Error("useAnimeContext must be used within an AnimeProvider");
  }
  return context;
};
