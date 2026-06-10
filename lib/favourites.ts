import { db, auth } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const KEY = 'ledger_favourites';

export type FavouriteItem = {
  id: string;
  type: 'bank' | 'savings' | 'current' | 'fds' | 'creditcards' | 'loans' | 'govtschemes' | 'insurance';
  lender: string;
  name: string;
  color: string;
  colorAccent: string;
  savedAt: number;
};

export const getFavourites = (): FavouriteItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

export const isFavourited = (id: string): boolean =>
  getFavourites().some(f => f.id === id);

export const toggleFavourite = async (item: FavouriteItem): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  const favs = getFavourites();
  const idx = favs.findIndex(f => f.id === item.id);
  if (idx > -1) {
    favs.splice(idx, 1);
  } else {
    favs.unshift(item);
  }
  localStorage.setItem(KEY, JSON.stringify(favs));

  // Sync to Firestore if signed in
  const user = auth.currentUser;
  if (user) {
    try {
      await setDoc(doc(db, 'users', user.uid), { favourites: favs }, { merge: true });
    } catch (e) {
      console.error('Error syncing favourites to Firestore:', e);
    }
  }
  return idx === -1;
};

export const loadFavouritesFromCloud = async (uid: string): Promise<void> => {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      const data = snap.data();
      if (data.favourites) {
        localStorage.setItem(KEY, JSON.stringify(data.favourites));
      }
    }
  } catch (e) {
    console.error('Error loading favourites from Firestore:', e);
  }
};

