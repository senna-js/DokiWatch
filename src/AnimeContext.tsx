import React, { createContext, useContext, useState } from "react";

interface AnimeContextType {
  triggerFetch: boolean;
  setTriggerFetch: React.Dispatch<React.SetStateAction<boolean>>;
}

const AnimeContext = createContext<AnimeContextType | undefined>(undefined);

export const useAnimeContext = () => {
  const context = useContext(AnimeContext);
  if (!context) {
    throw new Error("useAnimeContext must be used within an AnimeProvider");
  }
  return context;
};

export const AnimeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [triggerFetch, setTriggerFetch] = useState(false);

  return (
    <AnimeContext.Provider value={{ triggerFetch, setTriggerFetch }}>
      {children}
    </AnimeContext.Provider>
  );
};
