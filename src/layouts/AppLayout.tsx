/**
 * @fileoverview EcoPulse AI — App Layout.
 * Main layout with responsive navigation drawer, bottom nav, and footer.
 */

import { useState } from 'react';
import type { JSX } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, alpha } from '@mui/material/styles';

// Icons
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import ExtensionRoundedIcon from '@mui/icons-material/ExtensionRounded';
import PieChartRoundedIcon from '@mui/icons-material/PieChartRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';

import { useUserStore } from '../stores/appStore';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardRoundedIcon /> },
  { label: 'Tracker', path: '/tracker', icon: <TrackChangesRoundedIcon /> },
  { label: 'Coach', path: '/coach', icon: <SmartToyRoundedIcon /> },
  { label: 'Community', path: '/community', icon: <GroupsRoundedIcon /> },
];

const DRAWER_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardRoundedIcon /> },
  { label: 'Tracker', path: '/tracker', icon: <TrackChangesRoundedIcon /> },
  { label: 'AI Coach', path: '/coach', icon: <SmartToyRoundedIcon /> },
  { label: 'Community', path: '/community', icon: <GroupsRoundedIcon /> },
  { divider: true },
  { label: 'Impact Breakdown', path: '/impact', icon: <PieChartRoundedIcon /> },
  { label: 'Goals', path: '/goals', icon: <FlagRoundedIcon /> },
  { label: 'Challenges', path: '/challenges', icon: <ExtensionRoundedIcon /> },
  { label: 'Achievements', path: '/achievements', icon: <EmojiEventsRoundedIcon /> },
  { label: 'Resources', path: '/resources', icon: <MenuBookRoundedIcon /> },
  { divider: true },
  { label: 'Settings', path: '/settings', icon: <SettingsRoundedIcon /> },
];

/** Application shell layout with responsive navigation drawer, bottom nav, and footer. */
export default function AppLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUserStore((s) => s.user);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentNavIndex = NAV_ITEMS.findIndex((item) => location.pathname === item.path);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top App Bar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: alpha(theme.palette.background.default, 0.8),
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
          color: theme.palette.text.primary,
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
          <IconButton
            id="menu-button"
            edge="start"
            aria-label="Open navigation menu"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 1 }}
          >
            <MenuRoundedIcon />
          </IconButton>

          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', flex: 1 }}
            onClick={() => navigate('/dashboard')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/dashboard'); } }}
            role="button"
            tabIndex={0}
            aria-label="Go to dashboard"
          >
            <Box sx={{ fontSize: 28 }}>🌿</Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #52B788 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
              }}
            >
              EcoPulse AI
            </Typography>
          </Box>

          {/* Desktop nav links */}
          {!isMobile && (
            <Box component="nav" aria-label="Main navigation" sx={{ display: 'flex', gap: 0.5, mx: 4 }}>
              {NAV_ITEMS.map((item) => (
                <Box
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(item.path); } }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Navigate to ${item.label}`}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    cursor: 'pointer',
                    fontWeight: location.pathname === item.path ? 700 : 500,
                    fontSize: '0.875rem',
                    color: location.pathname === item.path
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                    background: location.pathname === item.path
                      ? alpha(theme.palette.primary.main, 0.08)
                      : 'transparent',
                    transition: 'all 0.2s',
                    '&:hover': {
                      background: alpha(theme.palette.primary.main, 0.06),
                    },
                    borderBottom: location.pathname === item.path
                      ? `2px solid ${theme.palette.primary.main}`
                      : '2px solid transparent',
                  }}
                >
                  {item.label}
                </Box>
              ))}
            </Box>
          )}

          <IconButton
            id="avatar-button"
            onClick={() => navigate('/settings')}
            aria-label="Open settings"
            sx={{
              background: alpha(theme.palette.primary.main, 0.08),
              '&:hover': { background: alpha(theme.palette.primary.main, 0.15) },
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: 16,
                background: 'linear-gradient(135deg, #2D6A4F, #52B788)',
              }}
            >
              {user?.displayName?.[0]?.toUpperCase() || '🌱'}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Side Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              background: theme.palette.background.default,
              borderRight: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
            },
          },
        }}
      >
        <Box sx={{ p: 3, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box sx={{ fontSize: 32 }}>🌿</Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: theme.palette.primary.dark }}>
              EcoPulse AI
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
            Turn everyday choices into climate action
          </Typography>
        </Box>

        <List component="nav" aria-label="Site navigation" sx={{ px: 1 }}>
          {DRAWER_ITEMS.map((item, index) => {
            if ('divider' in item && item.divider) {
              return <Divider key={`divider-${index}`} sx={{ my: 1 }} />;
            }
            const navItem = item as { label: string; path: string; icon: JSX.Element };
            const isActive = location.pathname === navItem.path;
            return (
              <ListItem key={navItem.path} disablePadding sx={{ mb: 0.3 }}>
                <ListItemButton
                  onClick={() => {
                    navigate(navItem.path);
                    setDrawerOpen(false);
                  }}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    background: isActive
                      ? alpha(theme.palette.primary.main, 0.1)
                      : 'transparent',
                    color: isActive
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                    '&:hover': {
                      background: alpha(theme.palette.primary.main, 0.06),
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isActive
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                    }}
                  >
                    {navItem.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={navItem.label}
                    slotProps={{
                      primary: {
                        sx: {
                          fontWeight: isActive ? 600 : 400,
                          fontSize: '0.9rem',
                        },
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        id="main-content"
        tabIndex={-1}
        sx={{
          flex: 1,
          pb: isMobile ? 10 : 4,
          px: { xs: 2, sm: 3, md: 4 },
          pt: { xs: 2, md: 3 },
          maxWidth: 1200,
          width: '100%',
          mx: 'auto',
        }}
      >
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <Outlet />
        </motion.div>
      </Box>

      {/* Bottom Navigation (mobile only) */}
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
            background: alpha(theme.palette.background.paper, 0.85),
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.06)',
          }}
        >
          <BottomNavigation
            value={currentNavIndex >= 0 ? currentNavIndex : false}
            onChange={(_, newValue) => {
              navigate(NAV_ITEMS[newValue].path);
            }}
            showLabels
            component="nav"
            aria-label="Mobile navigation"
            sx={{
              background: 'transparent',
              height: 64,
              '& .MuiBottomNavigationAction-root': {
                minWidth: 'auto',
                py: 1,
                color: theme.palette.text.secondary,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              },
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.7rem',
                fontWeight: 500,
                '&.Mui-selected': {
                  fontWeight: 700,
                  fontSize: '0.7rem',
                },
              },
            }}
          >
            {NAV_ITEMS.map((item) => (
              <BottomNavigationAction
                key={item.path}
                label={item.label}
                icon={item.icon}
                id={`bottom-nav-${item.label.toLowerCase()}`}
                aria-label={`Navigate to ${item.label}`}
              />
            ))}
          </BottomNavigation>
        </Box>
      )}

      {/* Footer (desktop only) */}
      {!isMobile && (
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 4,
            mt: 4,
            borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: 1200,
            width: '100%',
            mx: 'auto',
          }}
        >
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, color: theme.palette.primary.main }}
            >
              EcoPulse AI
            </Typography>
            <Typography variant="caption" color="text.secondary">
              © 2026 EcoPulse AI. Empowering personal climate action through AI.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {['Mission', 'Privacy', 'Methodology', 'About'].map((link) => (
              <Typography
                key={link}
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  '&:hover': { color: theme.palette.primary.main },
                  transition: 'color 0.2s',
                }}
              >
                {link}
              </Typography>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
