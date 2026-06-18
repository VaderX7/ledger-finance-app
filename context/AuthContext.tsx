'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { auth, signInWithGoogle, signOutUser, onAuthStateChanged, User } from '@/lib/firebase';
import { loadFavouritesFromCloud } from '@/lib/favourites';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null, 
  loading: true,
  signIn: async () => {}, 
  signOut: async () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => { 
      if (u) {
        try {
          await loadFavouritesFromCloud(u.uid);
        } catch (e) {
          console.error('Error loading cloud favourites on auth change:', e);
        }

      }
      setUser(u); 
      setLoading(false); 
    });
    return unsub;
  }, []);

  const signIn = async () => { 
    try { 
      await signInWithGoogle(); 
    } catch (e) { 
      console.error(e); 
    } 
  };
  
  const signOut = async () => { 
    try { 
      await signOutUser(); 
    } catch (e) { 
      console.error(e); 
    } 
  };

  return <AuthContext.Provider value={{ user, loading, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
