// Performance optimized component wrappers
import { memo } from 'react';
import About from './About';
import Catering from './Catering';
import Contact from './Contact';
import FinalCTA from './FinalCTA';
import TodaysLunch from './TodaysLunch';
import WeeklyMenu from './WeeklyMenu';
import StickyMobileActions from './StickyMobileActions';

// Memoize heavy components to prevent unnecessary re-renders
export const OptimizedAbout = memo(About);
export const OptimizedCatering = memo(Catering);
export const OptimizedContact = memo(Contact);
export const OptimizedFinalCTA = memo(FinalCTA);
export const OptimizedTodaysLunch = memo(TodaysLunch);
export const OptimizedWeeklyMenu = memo(WeeklyMenu);
export const OptimizedStickyMobileActions = memo(StickyMobileActions);

// Set display names for better debugging
OptimizedAbout.displayName = 'OptimizedAbout';
OptimizedCatering.displayName = 'OptimizedCatering';
OptimizedContact.displayName = 'OptimizedContact';
OptimizedFinalCTA.displayName = 'OptimizedFinalCTA';
OptimizedTodaysLunch.displayName = 'OptimizedTodaysLunch';
OptimizedWeeklyMenu.displayName = 'OptimizedWeeklyMenu';
OptimizedStickyMobileActions.displayName = 'OptimizedStickyMobileActions';