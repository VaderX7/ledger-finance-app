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

export const toggleFavourite = (item: FavouriteItem): boolean => {
  if (typeof window === 'undefined') return false;
  const favs = getFavourites();
  const idx = favs.findIndex(f => f.id === item.id);
  if (idx > -1) {
    favs.splice(idx, 1);
    localStorage.setItem(KEY, JSON.stringify(favs));
    return false; // removed
  } else {
    favs.unshift(item);
    localStorage.setItem(KEY, JSON.stringify(favs));
    return true; // added
  }
};
