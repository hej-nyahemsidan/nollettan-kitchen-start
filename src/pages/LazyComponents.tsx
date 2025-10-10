import { lazy } from 'react';

// Lazy load components that are below the fold
export const LazyAbout = lazy(() => import('@/components/About'));
export const LazyTodaysLunch = lazy(() => import('@/components/TodaysLunch'));
export const LazyWeeklyMenu = lazy(() => import('@/components/WeeklyMenu'));
export const LazyCatering = lazy(() => import('@/components/Catering'));
export const LazyContact = lazy(() => import('@/components/Contact'));
export const LazyFinalCTA = lazy(() => import('@/components/FinalCTA'));
export const LazyStickyMobileActions = lazy(() => import('@/components/StickyMobileActions'));