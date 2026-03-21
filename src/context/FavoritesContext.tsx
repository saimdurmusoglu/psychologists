import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuth } from './AuthContext'

interface Psychologist {
  name: string
  avatar_url: string
  experience: string
  reviews: { reviewer: string; rating: number; comment: string }[]
  price_per_hour: number
  rating: number
  license: string
  specialization: string
  initial_consultation: string
  about: string
}

interface FavoritesContextType {
  favorites: Psychologist[]
  addFavorite: (psychologist: Psychologist) => void
  removeFavorite: (name: string) => void
  isFavorite: (name: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | null>(null)

function getStorageKey(uid: string): string {
  return `favorites_${uid}`
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<Psychologist[]>([])

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(getStorageKey(user.uid))
      setFavorites(stored ? JSON.parse(stored) : [])
    } else {
      setFavorites([])
    }
  }, [user])

  const saveFavorites = (newFavs: Psychologist[]) => {
    setFavorites(newFavs)
    if (user) {
      localStorage.setItem(getStorageKey(user.uid), JSON.stringify(newFavs))
    }
  }

  const addFavorite = (psychologist: Psychologist) => saveFavorites([...favorites, psychologist])
  const removeFavorite = (name: string) => saveFavorites(favorites.filter(p => p.name !== name))
  const isFavorite = (name: string) => favorites.some(p => p.name === name)

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = (): FavoritesContextType => {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}