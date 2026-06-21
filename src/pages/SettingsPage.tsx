/**
 * @fileoverview EcoPulse AI — Settings Page.
 * Profile, appearance, privacy, data management, about.
 */

import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  useTheme,
  alpha,
  InputAdornment,
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Person as PersonIcon,
  Palette as PaletteIcon,
  LightMode as LightIcon,
  DarkMode as DarkIcon,
  SettingsBrightness as SystemIcon,
  Shield as PrivacyIcon,
  Storage as DataIcon,
  Download as ExportIcon,
  DeleteSweep as ClearIcon,
  DeleteForever as DeleteIcon,
  Info as InfoIcon,
  VpnKey as KeyIcon,
  Notifications as NotifIcon,
  Straighten as UnitsIcon,
  Visibility as ShowIcon,
  VisibilityOff as HideIcon,
  Science as MethodIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  pageVariants,
  staggerContainer,
  staggerItem,
  fadeInUp,
} from '../theme/animations';
import { useUserStore, useChatStore } from '../stores/appStore';
import { useGlassStyle } from '../hooks/useGlassStyle';

// ---- Avatar emoji options ----

const AVATAR_EMOJIS = ['🌱', '🌿', '🌍', '🌊', '🦋', '🐝', '🌻', '🍃', '⚡', '🌈', '🦉', '🐢'];



// ---- SettingsPage ----

/** Settings page with profile, appearance, API key, privacy, data management, and about sections. */
const SettingsPage: React.FC = () => {
  const theme = useTheme();
  const glass = useGlassStyle({ mb: 3 });
  const { user, updatePreferences, deleteAccount } = useUserStore();
  const { clearHistory } = useChatStore();

  // Local state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clearChatDialogOpen, setClearChatDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('VITE_GEMINI_API_KEY') || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatarUrl || '🌱');
  const [displayName, setDisplayName] = useState(user?.displayName || 'Eco Explorer');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  const currentTheme = user?.preferences?.theme || 'light';
  const notifications = user?.preferences?.notifications ?? true;
  const units = user?.preferences?.units || 'metric';

  // ---- Handlers ----

  const handleThemeChange = useCallback(
    (_: React.MouseEvent<HTMLElement>, value: string | null) => {
      if (value) updatePreferences({ theme: value as 'light' | 'dark' | 'system' });
    },
    [updatePreferences]
  );

  const handleNotifToggle = useCallback(() => {
    updatePreferences({ notifications: !notifications });
  }, [updatePreferences, notifications]);

  const handleUnitsToggle = useCallback(() => {
    updatePreferences({ units: units === 'metric' ? 'imperial' : 'metric' });
  }, [updatePreferences, units]);

  const handleExportData = useCallback(() => {
    const allData: Record<string, string | null> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('ecopulse-')) {
        allData[key] = localStorage.getItem(key);
      }
    }
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecopulse-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const handleClearChat = useCallback(() => {
    clearHistory();
    setClearChatDialogOpen(false);
  }, [clearHistory]);

  const handleDeleteAccount = useCallback(() => {
    deleteAccount();
    setDeleteDialogOpen(false);
  }, [deleteAccount]);

  const handleSaveApiKey = useCallback(() => {
    localStorage.setItem('VITE_GEMINI_API_KEY', apiKey.trim());
    setSnackbar({ open: true, message: 'API key saved! 🔑' });
  }, [apiKey]);

  const handleSaveProfile = useCallback(() => {
    if (user) {
      useUserStore.setState((state) => ({
        user: state.user
          ? { ...state.user, displayName, avatarUrl: selectedAvatar }
          : null,
      }));
      setSnackbar({ open: true, message: 'Profile saved! ✅' });
    }
  }, [user, displayName, selectedAvatar]);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <Box sx={{ maxWidth: 700, mx: 'auto', px: { xs: 2, sm: 3 }, py: 3 }}>

        {/* Header */}
        <motion.div variants={fadeInUp}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SettingsIcon sx={{ color: 'primary.main', fontSize: 32 }} />
              Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Customize your EcoPulse AI experience
            </Typography>
          </Box>
        </motion.div>

        <motion.div variants={staggerContainer} initial="initial" animate="animate">

          {/* ============ Profile Section ============ */}
          <motion.div variants={staggerItem}>
            <Card sx={glass}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <PersonIcon sx={{ color: 'primary.main' }} />
                  Profile
                </Typography>

                {/* Display Name */}
                <TextField
                  label="Display Name"
                  fullWidth
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  id="settings-display-name"
                  sx={{ mb: 2.5 }}
                  size="small"
                />

                {/* Avatar Emoji Selector */}
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  Choose your avatar
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {AVATAR_EMOJIS.map((emoji) => (
                    <IconButton
                      key={emoji}
                      onClick={() => setSelectedAvatar(emoji)}
                      id={`avatar-${emoji}`}
                      aria-label={`Select avatar ${emoji}`}
                      sx={{
                        width: 48,
                        height: 48,
                        fontSize: '1.5rem',
                        borderRadius: '14px',
                        border: selectedAvatar === emoji
                          ? `2px solid ${theme.palette.primary.main}`
                          : `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                        background: selectedAvatar === emoji
                          ? alpha(theme.palette.primary.main, 0.1)
                          : 'transparent',
                        transform: selectedAvatar === emoji ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'scale(1.15)',
                          background: alpha(theme.palette.primary.main, 0.08),
                        },
                      }}
                    >
                      {emoji}
                    </IconButton>
                  ))}
                </Box>

                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSaveProfile}
                  id="save-profile-button"
                  sx={{ borderRadius: '12px', px: 3, fontWeight: 700 }}
                >
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* ============ Appearance Section ============ */}
          <motion.div variants={staggerItem}>
            <Card sx={glass}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <PaletteIcon sx={{ color: 'primary.main' }} />
                  Appearance
                </Typography>

                {/* Theme toggle */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  Theme
                </Typography>
                <ToggleButtonGroup
                  value={currentTheme}
                  exclusive
                  onChange={handleThemeChange}
                  aria-label="Theme selection"
                  sx={{
                    mb: 2,
                    '& .MuiToggleButton-root': {
                      borderRadius: '12px !important',
                      px: 2.5,
                      py: 1,
                      fontWeight: 600,
                      textTransform: 'none',
                      border: `1px solid ${alpha(theme.palette.divider, 0.2)} !important`,
                      '&.Mui-selected': {
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.primary.main, 0.05)})`,
                        borderColor: `${alpha(theme.palette.primary.main, 0.4)} !important`,
                        color: theme.palette.primary.main,
                      },
                    },
                  }}
                >
                  <ToggleButton value="light" id="theme-light" aria-label="Light theme">
                    <LightIcon sx={{ mr: 0.5, fontSize: 18 }} /> Light
                  </ToggleButton>
                  <ToggleButton value="dark" id="theme-dark" aria-label="Dark theme">
                    <DarkIcon sx={{ mr: 0.5, fontSize: 18 }} /> Dark
                  </ToggleButton>
                  <ToggleButton value="system" id="theme-system" aria-label="System theme">
                    <SystemIcon sx={{ mr: 0.5, fontSize: 18 }} /> System
                  </ToggleButton>
                </ToggleButtonGroup>

                <Divider sx={{ my: 2, opacity: 0.3 }} />

                {/* Notifications */}
                <List disablePadding>
                  <ListItem disableGutters sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <NotifIcon sx={{ color: notifications ? 'primary.main' : 'text.secondary' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Notifications"
                      secondary="Get reminders for goals and challenges"
                      slotProps={{
                        primary: { sx: { fontWeight: 600, fontSize: '0.875rem' } },
                        secondary: { sx: { fontSize: '0.75rem' } },
                      }}
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={notifications}
                        onChange={handleNotifToggle}
                        id="settings-notifications"
                        slotProps={{ input: { 'aria-label': 'Toggle notifications' } }}
                        color="primary"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  {/* Units */}
                  <ListItem disableGutters sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <UnitsIcon sx={{ color: 'text.secondary' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Units"
                      secondary={units === 'metric' ? 'Metric (kg, km)' : 'Imperial (lbs, mi)'}
                      slotProps={{
                        primary: { sx: { fontWeight: 600, fontSize: '0.875rem' } },
                        secondary: { sx: { fontSize: '0.75rem' } },
                      }}
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={units === 'imperial'}
                        onChange={handleUnitsToggle}
                        id="settings-units"
                        slotProps={{ input: { 'aria-label': 'Toggle units' } }}
                        color="primary"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </motion.div>

          {/* ============ Gemini API Key ============ */}
          <motion.div variants={staggerItem}>
            <Card sx={glass}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <KeyIcon sx={{ color: 'primary.main' }} />
                  AI Coach (Gemini)
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                  Enter your Google Gemini API key to enable the AI eco-coach feature. Your key is stored locally and never sent to our servers.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    type={showApiKey ? 'text' : 'password'}
                    placeholder="Enter your Gemini API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    id="settings-api-key"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowApiKey(!showApiKey)}
                              edge="end"
                              size="small"
                              aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                              id="toggle-api-key-visibility"
                            >
                              {showApiKey ? <HideIcon fontSize="small" /> : <ShowIcon fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSaveApiKey}
                    id="save-api-key-button"
                    sx={{ borderRadius: '12px', px: 3, fontWeight: 700, flexShrink: 0 }}
                  >
                    Save
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* ============ Privacy Section ============ */}
          <motion.div variants={staggerItem}>
            <Card sx={glass}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <PrivacyIcon sx={{ color: 'primary.main' }} />
                  Privacy & Methodology
                </Typography>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    background: alpha(theme.palette.info.main, 0.06),
                    border: `1px solid ${alpha(theme.palette.info.main, 0.12)}`,
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <InfoIcon sx={{ fontSize: 16 }} /> Disclaimer
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    All carbon footprint estimates are approximate and based on publicly available emissions factors. 
                    Individual results may vary based on region, lifestyle specifics, and data accuracy. 
                    EcoPulse AI is designed for educational awareness — not as a certified carbon accounting tool.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    background: alpha(theme.palette.success.main, 0.06),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.12)}`,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <MethodIcon sx={{ fontSize: 16 }} /> Methodology
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    Calculations are based on EPA emission factors, IPCC guidelines, and peer-reviewed lifecycle assessment 
                    data. Transportation emissions use average vehicle efficiency data. Diet emissions reference the 
                    &quot;Reducing food&apos;s environmental impacts&quot; study (Poore &amp; Nemecek, 2018). 
                    Energy emissions use regional grid averages.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* ============ Data Management ============ */}
          <motion.div variants={staggerItem}>
            <Card sx={glass}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <DataIcon sx={{ color: 'primary.main' }} />
                  Data Management
                </Typography>

                <List disablePadding>
                  {/* Export Data */}
                  <ListItem
                    disableGutters
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderRadius: '12px',
                      mb: 1,
                      '&:hover': { background: alpha(theme.palette.primary.main, 0.04) },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <ExportIcon sx={{ color: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Export Data"
                      secondary="Download all your data as a JSON file"
                      slotProps={{
                        primary: { sx: { fontWeight: 600, fontSize: '0.875rem' } },
                        secondary: { sx: { fontSize: '0.75rem' } },
                      }}
                    />
                    <ListItemSecondaryAction>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleExportData}
                        id="export-data-button"
                        sx={{ borderRadius: '10px', fontWeight: 600, textTransform: 'none' }}
                      >
                        Export
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>

                  {/* Clear Chat */}
                  <ListItem
                    disableGutters
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderRadius: '12px',
                      mb: 1,
                      '&:hover': { background: alpha(theme.palette.warning.main, 0.04) },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <ClearIcon sx={{ color: 'warning.main' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Clear Chat History"
                      secondary="Remove all AI coach conversations"
                      slotProps={{
                        primary: { sx: { fontWeight: 600, fontSize: '0.875rem' } },
                        secondary: { sx: { fontSize: '0.75rem' } },
                      }}
                    />
                    <ListItemSecondaryAction>
                      <Button
                        variant="outlined"
                        size="small"
                        color="warning"
                        onClick={() => setClearChatDialogOpen(true)}
                        id="clear-chat-button"
                        sx={{ borderRadius: '10px', fontWeight: 600, textTransform: 'none' }}
                      >
                        Clear
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>

                  {/* Delete Account */}
                  <ListItem
                    disableGutters
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderRadius: '12px',
                      '&:hover': { background: alpha(theme.palette.error.main, 0.04) },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <DeleteIcon sx={{ color: 'error.main' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Delete Account"
                      secondary="Permanently remove all data and reset the app"
                      slotProps={{
                        primary: { sx: { fontWeight: 600, fontSize: '0.875rem', color: 'error.main' } },
                        secondary: { sx: { fontSize: '0.75rem' } },
                      }}
                    />
                    <ListItemSecondaryAction>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => setDeleteDialogOpen(true)}
                        id="delete-account-button"
                        sx={{ borderRadius: '10px', fontWeight: 600, textTransform: 'none' }}
                      >
                        Delete
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </motion.div>

          {/* ============ About Section ============ */}
          <motion.div variants={staggerItem}>
            <Card sx={glass}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <InfoIcon sx={{ color: 'primary.main' }} />
                  About EcoPulse AI
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Version</Typography>
                    <Chip label="1.0.0" size="small" sx={{ fontWeight: 700, fontSize: '0.75rem' }} />
                  </Box>
                  <Divider sx={{ opacity: 0.2 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Methodology Sources
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      • EPA GHG Emission Factors Hub (2024){'\n'}
                      • IPCC AR6 Emissions Factors{'\n'}
                      • Poore &amp; Nemecek (2018) — Food environmental impacts{'\n'}
                      • IEA Regional Grid Emission Factors{'\n'}
                      • World Bank Climate Data
                    </Typography>
                  </Box>
                  <Divider sx={{ opacity: 0.2 }} />
                  <Box sx={{ textAlign: 'center', pt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Built with 💚 for a sustainable future
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>

        </motion.div>

        {/* ============ Clear Chat Confirmation Dialog ============ */}
        <Dialog
          open={clearChatDialogOpen}
          onClose={() => setClearChatDialogOpen(false)}
          slotProps={{
            paper: {
              sx: {
                borderRadius: '20px',
                background: theme.palette.mode === 'dark'
                  ? alpha('#1A2940', 0.95)
                  : alpha('#FFFFFF', 0.97),
                backdropFilter: 'blur(20px)',
              },
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>
            Clear Chat History?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              This will permanently delete all your conversations with the AI coach. This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setClearChatDialogOpen(false)} id="cancel-clear-chat">
              Cancel
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={handleClearChat}
              id="confirm-clear-chat"
              sx={{ borderRadius: '12px', fontWeight: 700 }}
            >
              Clear History
            </Button>
          </DialogActions>
        </Dialog>

        {/* ============ Delete Account Confirmation Dialog ============ */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          slotProps={{
            paper: {
              sx: {
                borderRadius: '20px',
                background: theme.palette.mode === 'dark'
                  ? alpha('#1A2940', 0.95)
                  : alpha('#FFFFFF', 0.97),
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
              },
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, color: 'error.main' }}>
            ⚠️ Delete Account?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              This will permanently delete ALL your data including your profile, assessment results, goals, challenges, 
              achievements, and chat history. The app will be completely reset. This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDeleteDialogOpen(false)} id="cancel-delete-account">
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteAccount}
              id="confirm-delete-account"
              sx={{ borderRadius: '12px', fontWeight: 700 }}
            >
              Delete Everything
            </Button>
          </DialogActions>
        </Dialog>

        {/* ============ Snackbar Toast Feedback ============ */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ open: false, message: '' })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ open: false, message: '' })}
            severity="success"
            variant="filled"
            sx={{ width: '100%', borderRadius: '12px', fontWeight: 600 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </motion.div>
  );
};

export default SettingsPage;
