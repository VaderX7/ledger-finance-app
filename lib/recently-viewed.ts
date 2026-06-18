const KEY = 'truely_recently_viewed';
const MAX = 5;

export interface RecentlyViewedItem {
  id: string;
  name: string;
  lender: string;
  category: string;
  color: string;
  colorAccent: string;
  viewedAt: number;
}

export const addRecentlyViewed = (item: RecentlyViewedItem): void => {
  if (typeof window === 'undefined') return;
  const existing = getRecentlyViewed().filter(i => i.id !== item.id);
  const updated = [item, ...existing].slice(0, MAX);
  localStorage.setItem(KEY, JSON.stringify(updated));
};

export const getRecentlyViewed = (): RecentlyViewedItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};
