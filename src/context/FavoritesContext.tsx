import {createContext, useContext, useEffect, useState, ReactNode} from "react";
import {useAuth} from "./AuthContext";

interface Psychologist {
  name: string;
  avatar_url: string;
  experience: string;
  reviews: {reviewer: string; rating: number; comment: string}[];
  price_per_hour: number;
  rating: number;
  license: string;
  specialization: string;
  initial_consultation: string;
  about: string;
}

interface FavoritesContextType {
  favorites: Psychologist[];
  addFavorite: (psychologist: Psychologist) => void;
  removeFavorite: (name: string) => void;
  isFavorite: (name: string) => boolean;
  setFavorites: (items: Psychologist[]) => void;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

function getStorageKey(uid: string): string {
  return `favorites_${uid}`;
}

export function FavoritesProvider({children}: {children: ReactNode}) {
  const {user} = useAuth();
  const [favorites, setFavoritesState] = useState<Psychologist[]>([]);

  useEffect(() => {
    if (user?.uid) {
      const stored = localStorage.getItem(getStorageKey(user.uid));
      setFavoritesState(stored ? JSON.parse(stored) : []);
    } else if (user === null) {
      setFavoritesState([]);
    }
  }, [user?.uid]);

  const saveFavorites = (newList: Psychologist[]) => {
    setFavoritesState(newList);
    if (user) {
      localStorage.setItem(getStorageKey(user.uid), JSON.stringify(newList));
    }
  };

  const addFavorite = (psychologist: Psychologist) =>
    saveFavorites([...favorites, psychologist]);
  const removeFavorite = (name: string) =>
    saveFavorites(favorites.filter((p) => p.name !== name));
  const isFavorite = (name: string) => favorites.some((p) => p.name === name);
  const setFavorites = (items: Psychologist[]) => saveFavorites(items);

  return (
    <FavoritesContext.Provider
      value={{favorites, addFavorite, removeFavorite, isFavorite, setFavorites}}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = (): FavoritesContextType => {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
};
