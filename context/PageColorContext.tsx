'use client';

import { createContext, useContext } from 'react';

const PAGE_COLORS: Record<string, string> = {
  '/': '#C9A96E',
  '/search': '#00E5FF',
  '/tools': '#00F5A0',
  '/profile': '#8B5CF6',
};

export const getPageColor = (pathname: string): string =>
  PAGE_COLORS[pathname] ?? '#C9A96E';

const PageColorContext = createContext<string>('#C9A96E');

export function PageColorProvider({ children }: { children: React.ReactNode }) {
  return children;
}

export function usePageColor() {
  return useContext(PageColorContext);
}
