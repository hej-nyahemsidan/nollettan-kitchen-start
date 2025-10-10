import { lazy } from 'react';

// Lazy load optimized components that are below the fold
export const LazyAbout = lazy(() => import('@/components/OptimizedComponents').then(module => ({ default: module.OptimizedAbout })));
export const LazyTodaysLunch = lazy(() => import('@/components/OptimizedComponents').then(module => ({ default: module.OptimizedTodaysLunch })));
export const LazyWeeklyMenu = lazy(() => import('@/components/OptimizedComponents').then(module => ({ default: module.OptimizedWeeklyMenu })));
export const LazyCatering = lazy(() => import('@/components/OptimizedComponents').then(module => ({ default: module.OptimizedCatering })));
export const LazyContact = lazy(() => import('@/components/OptimizedComponents').then(module => ({ default: module.OptimizedContact })));
export const LazyFinalCTA = lazy(() => import('@/components/OptimizedComponents').then(module => ({ default: module.OptimizedFinalCTA })));
export const LazyStickyMobileActions = lazy(() => import('@/components/OptimizedComponents').then(module => ({ default: module.OptimizedStickyMobileActions })));