/**
 * @fileoverview EcoPulse AI — App Shell.
 * Root component with React Router routing, MUI theme provider, and layout.
 */

import React, { useMemo, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AnimatePresence } from 'framer-motion';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { lightTheme, darkTheme } from './theme/theme';
import { useUserStore } from './stores/appStore';
import AppLayout from './layouts/AppLayout';

// Lazy-loaded pages for code splitting
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AssessmentPage = lazy(() => import('./pages/AssessmentPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const TrackerPage = lazy(() => import('./pages/TrackerPage'));
const CoachPage = lazy(() => import('./pages/CoachPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const GoalsPage = lazy(() => import('./pages/GoalsPage'));
const ChallengeCenterPage = lazy(() => import('./pages/ChallengeCenterPage'));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'));
const ImpactBreakdownPage = lazy(() => import('./pages/ImpactBreakdownPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));

/** Full-screen loading fallback shown while lazy-loaded route chunks are fetched. */
function LoadingScreen(): React.JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
        background: 'linear-gradient(135deg, #F0F7F4 0%, #E8F5E9 100%)',
      }}
    >
      <Box sx={{ fontSize: 48, animation: 'pulse 1.5s ease-in-out infinite' }}>🌿</Box>
      <CircularProgress sx={{ color: '#2D6A4F' }} />
      <style>{`@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }`}</style>
    </Box>
  );
}

/** Root application component providing theming, routing, and code-split pages. */
export default function App(): React.JSX.Element {
  const user = useUserStore((s) => s.user);
  const themePref = user?.preferences?.theme ?? 'light';

  const theme = useMemo(() => {
    if (themePref === 'dark') return darkTheme;
    if (themePref === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? darkTheme
        : lightTheme;
    }
    return lightTheme;
  }, [themePref]);

  return (
    <ThemeProvider theme={theme}>
      <Suspense fallback={<LoadingScreen />}>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/assessment" element={<AssessmentPage />} />

            {/* App routes with layout */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/tracker" element={<TrackerPage />} />
              <Route path="/coach" element={<CoachPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/challenges" element={<ChallengeCenterPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/impact" element={<ImpactBreakdownPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </ThemeProvider>
  );
}
