/**
 * @fileoverview EcoPulse AI — Community Page.
 * Community insights, leaderboard, and social engagement.
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Chip,
  Avatar,
  useTheme,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  GroupsRounded as GroupsIcon,
  PublicRounded as GlobalIcon,
  LocationOnRounded as LocalIcon,
  EmojiEventsRounded as TrophyIcon,
  ArrowForwardRounded as ArrowForwardIcon,
  WhatshotRounded as StreakIcon,
  Co2Rounded as Co2Icon,
  Diversity3Rounded as CommunityIcon,
  VolunteerActivismRounded as HeartIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { useCarbonStore } from '../stores/appStore';
import { SAMPLE_LEADERBOARD } from '../data/defaults';
import type { LeaderboardEntry } from '../types';
import {
  pageVariants,
  staggerContainer,
  fadeInUp,
} from '../theme/animations';
import GlassCard from '../components/GlassCard';

// ---- Animated Number Display ----

const AnimatedDigit: React.FC<{ value: string }> = React.memo(({ value }) => (
  <motion.span
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    style={{ display: 'inline-block' }}
  >
    {value}
  </motion.span>
));
AnimatedDigit.displayName = 'AnimatedDigit';


// ---- Rank Badge ----

const RankBadge: React.FC<{ rank: number }> = React.memo(({ rank }) => {
  const medals: Record<number, { emoji: string; bg: string; border: string }> = {
    1: { emoji: '🥇', bg: 'linear-gradient(135deg, #FFD700, #FFA500)', border: '#FFD700' },
    2: { emoji: '🥈', bg: 'linear-gradient(135deg, #C0C0C0, #A0A0A0)', border: '#C0C0C0' },
    3: { emoji: '🥉', bg: 'linear-gradient(135deg, #CD7F32, #B87333)', border: '#CD7F32' },
  };

  const medal = medals[rank];

  if (medal) {
    return (
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: medal.bg,
          boxShadow: `0 4px 12px ${alpha(medal.border, 0.4)}`,
          fontSize: '1.1rem',
        }}
      >
        {medal.emoji}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: alpha('#546E7A', 0.1),
        fontWeight: 700,
        fontSize: '0.85rem',
        color: 'text.secondary',
      }}
    >
      {rank}
    </Box>
  );
});
RankBadge.displayName = 'RankBadge';

// ---- Comparison Chart Data ----

function getComparisonData(userKg: number): { name: string; value: number; color: string }[] {
  return [
    { name: 'You', value: Math.round(userKg / 1000 * 10) / 10 * 1000, color: '#52B788' },
    { name: 'National Avg', value: 4700, color: '#FF6B6B' },
    { name: 'Eco-Champion', value: 2000, color: '#48CAE4' },
  ];
}

// ---- Leaderboard Table ----

const LeaderboardTable: React.FC<{ data: LeaderboardEntry[] }> = React.memo(({ data }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <TableContainer
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        '& .MuiTableCell-root': {
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
        },
      }}
    >
      <Table size="small" aria-label="Community leaderboard">
        <TableHead>
          <TableRow
            sx={{
              background: isDark ? alpha('#1A2940', 0.5) : alpha('#F0F7F4', 0.8),
            }}
          >
            <TableCell sx={{ fontWeight: 700, fontSize: '0.78rem', width: 60 }}>Rank</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: '0.78rem' }}>Name</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.78rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.3 }}>
                <StreakIcon sx={{ fontSize: 14, color: '#FF6B6B' }} />
                Streak
              </Box>
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.78rem' }}>
              CO₂ Saved
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((entry, idx) => (
            <TableRow
              key={entry.rank}
              component={motion.tr}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.4 }}
              sx={{
                transition: 'background 0.2s ease',
                '&:hover': {
                  background: isDark ? alpha('#52B788', 0.06) : alpha('#52B788', 0.04),
                },
              }}
            >
              <TableCell>
                <RankBadge rank={entry.rank} />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                  <Avatar
                    sx={{
                      width: 34,
                      height: 34,
                      fontSize: '1.1rem',
                      background: alpha('#52B788', 0.12),
                    }}
                  >
                    {entry.avatar}
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {entry.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={`${entry.streak} days`}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    height: 22,
                    background:
                      entry.streak >= 30
                        ? alpha('#FF6B6B', 0.12)
                        : entry.streak >= 15
                        ? alpha('#F9A826', 0.12)
                        : alpha('#48CAE4', 0.12),
                    color:
                      entry.streak >= 30 ? '#E63946' : entry.streak >= 15 ? '#E07A00' : '#0096C7',
                  }}
                  icon={<StreakIcon sx={{ fontSize: '14px !important' }} />}
                />
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D6A4F', fontSize: '0.88rem' }}>
                  {entry.totalCO2SavedKg} kg
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});
LeaderboardTable.displayName = 'LeaderboardTable';

// ---- Main Page ----

/** Community page with global stats, leaderboard, comparison charts, and social sharing. */
const CommunityPage: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const report = useCarbonStore((s) => s.currentReport);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'info' }>({ open: false, message: '', severity: 'info' });

  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  }, []);

  const comparisonData = useMemo(
    () => getComparisonData(report?.totalKgCO2e ?? 4500),
    [report]
  );

  // Simulated local leaderboard (shuffled subset with adjusted ranks)
  const localLeaderboard = useMemo(
    () =>
      SAMPLE_LEADERBOARD.slice(0, 5).map((entry, idx) => ({
        ...entry,
        rank: idx + 1,
        name: ['Local Hero ' + entry.name.split(' ')[0], entry.name][idx % 2 === 0 ? 0 : 1],
      })),
    []
  );

  const displayedLeaderboard = activeTab === 0 ? SAMPLE_LEADERBOARD : localLeaderboard;

  const globalCO2Saved = 1452890; // sample aggregate
  const formattedCO2 = globalCO2Saved.toLocaleString();

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <Box sx={{ pb: 10, px: { xs: 2, sm: 3 } }}>
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          {/* ===================== HERO SECTION ===================== */}
          <motion.div variants={fadeInUp}>
            <Card
              id="community-hero"
              sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 5,
                mb: 3,
                background: `linear-gradient(135deg, #1B4332 0%, #2D6A4F 35%, #48CAE4 100%)`,
                color: '#fff',
                boxShadow: `0 16px 64px ${alpha('#1B4332', 0.4)}`,
              }}
            >
              {/* Decorative floating circles */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -60,
                  right: -30,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -30,
                  left: 30,
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(82,183,136,0.2) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />

              <CardContent sx={{ py: { xs: 4, md: 5 }, px: { xs: 3, md: 5 }, position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CommunityIcon sx={{ fontSize: 24, color: alpha('#fff', 0.85) }} />
                  <Typography
                    variant="overline"
                    sx={{ color: alpha('#fff', 0.8), letterSpacing: 2, fontSize: '0.75rem' }}
                  >
                    Community Insights
                  </Typography>
                </Box>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 900,
                    mb: 1.5,
                    fontSize: { xs: '1.6rem', sm: '2rem' },
                    textShadow: '0 2px 16px rgba(0,0,0,0.15)',
                  }}
                >
                  Together We're Making a Difference
                </Typography>

                {/* Global CO₂ Saved Counter */}
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 3,
                    py: 1.5,
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <GlobalIcon sx={{ fontSize: 28, color: '#74C69D' }} />
                  </motion.div>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1, fontSize: { xs: '1.3rem', sm: '1.5rem' } }}>
                      {formattedCO2} kg
                    </Typography>
                    <Typography variant="caption" sx={{ color: alpha('#fff', 0.75), fontSize: '0.72rem' }}>
                      Total CO₂ saved by our community
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* ===================== YOUR FOOTPRINT VS. OTHERS ===================== */}
          <GlassCard id="footprint-comparison" sx={{ mb: 3, borderRadius: 4 }}>
            <CardContent sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                <Co2Icon sx={{ color: theme.palette.primary.main, fontSize: 22 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                  Your Footprint vs. Others
                </Typography>
              </Box>

              <Box sx={{ width: '100%', height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.08)} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: theme.palette.text.secondary, fontSize: 12, fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}t`}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: 12,
                        border: '1px solid rgba(0,0,0,0.06)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                      }}
                      formatter={(value: unknown): [string, string] => [`${(Number(value) / 1000).toFixed(1)} tonnes CO₂e`, '']}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={48} animationDuration={1200}>
                      {comparisonData.map((entry, idx) => (
                        <Cell
                          key={`bar-${idx}`}
                          fill={entry.color}
                          style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </GlassCard>

          {/* ===================== JOIN A LOCAL GROUP ===================== */}
          <GlassCard
            id="join-local-group"
            sx={{
              mb: 3,
              borderRadius: 4,
              background: isDark
                ? `linear-gradient(135deg, ${alpha('#1A2940', 0.9)}, ${alpha('#48CAE4', 0.12)})`
                : `linear-gradient(135deg, rgba(255,255,255,0.95), ${alpha('#48CAE4', 0.1)})`,
              borderLeft: '4px solid #48CAE4',
            }}
          >
            <CardContent
              sx={{
                py: 3,
                px: 3,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `linear-gradient(135deg, #48CAE4, #0096C7)`,
                  boxShadow: `0 8px 24px ${alpha('#48CAE4', 0.35)}`,
                  flexShrink: 0,
                }}
              >
                <GroupsIcon sx={{ fontSize: 30, color: '#fff' }} />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem', mb: 0.3 }}>
                  Join a Local Group
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, fontSize: '0.85rem' }}>
                  Connect with eco-conscious neighbors to share tips, organize events, and track collective impact in your area.
                </Typography>
              </Box>

              <Button
                id="btn-join-group"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={() => setSnackbar({ open: true, message: '🌍 Local groups feature coming soon! We\'re building neighborhood eco-communities.', severity: 'info' })}
                sx={{
                  background: `linear-gradient(135deg, #48CAE4, #0096C7)`,
                  fontWeight: 700,
                  px: 3,
                  flexShrink: 0,
                  boxShadow: `0 4px 16px ${alpha('#48CAE4', 0.3)}`,
                  '&:hover': {
                    background: `linear-gradient(135deg, #0096C7, #48CAE4)`,
                    boxShadow: `0 8px 24px ${alpha('#48CAE4', 0.4)}`,
                  },
                }}
              >
                Find Groups
              </Button>
            </CardContent>
          </GlassCard>

          {/* ===================== LEADERBOARD ===================== */}
          <GlassCard id="leaderboard" sx={{ borderRadius: 4, mb: 3 }}>
            <CardContent sx={{ py: 3, px: { xs: 1.5, sm: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, px: { xs: 1, sm: 0 } }}>
                <TrophyIcon sx={{ color: '#F9A826', fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                  Leaderboard
                </Typography>
              </Box>

              {/* Global / Local Tabs */}
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="fullWidth"
                aria-label="Leaderboard scope"
                sx={{
                  mb: 2,
                  minHeight: 40,
                  mx: { xs: 0.5, sm: 0 },
                  borderRadius: 3,
                  background: isDark ? alpha('#1A2940', 0.5) : alpha('#F0F7F4', 0.8),
                  '& .MuiTab-root': {
                    minHeight: 40,
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    textTransform: 'none',
                    borderRadius: 2.5,
                    transition: 'all 0.3s ease',
                  },
                  '& .Mui-selected': {
                    background: isDark ? alpha('#52B788', 0.15) : alpha('#2D6A4F', 0.08),
                    color: `${theme.palette.primary.main} !important`,
                  },
                  '& .MuiTabs-indicator': {
                    display: 'none',
                  },
                }}
              >
                <Tab
                  id="tab-global"
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <GlobalIcon sx={{ fontSize: 18 }} /> Global
                    </Box>
                  }
                />
                <Tab
                  id="tab-local"
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocalIcon sx={{ fontSize: 18 }} /> Local
                    </Box>
                  }
                />
              </Tabs>

              <LeaderboardTable data={displayedLeaderboard} />
            </CardContent>
          </GlassCard>

          {/* ===================== COMMUNITY FOOTER CTA ===================== */}
          <motion.div variants={fadeInUp}>
            <Card
              id="community-cta"
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                background: isDark
                  ? `linear-gradient(135deg, ${alpha('#1A2940', 0.9)}, ${alpha('#2D6A4F', 0.4)})`
                  : `linear-gradient(135deg, rgba(255,255,255,0.95), ${alpha('#52B788', 0.12)})`,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${isDark ? alpha('#52B788', 0.12) : alpha('#2D6A4F', 0.08)}`,
                textAlign: 'center',
              }}
            >
              <CardContent sx={{ py: 4, px: 3 }}>
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <HeartIcon sx={{ fontSize: 42, color: '#E63946', mb: 1 }} />
                </motion.div>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                  Every Action Counts
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mb: 2, lineHeight: 1.6 }}>
                  Share your progress, inspire friends, and collectively reduce our global footprint — one habit at a time.
                </Typography>
                <Button
                  id="btn-share-progress"
                  variant="contained"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'EcoPulse AI — My Carbon Footprint',
                        text: `I'm tracking my carbon footprint with EcoPulse AI! ${report ? `My footprint is ${report.totalTonnesCO2e} tCO₂e/year.` : ''} Join me in making a difference! 🌿`,
                        url: window.location.origin,
                      }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(
                        `I'm tracking my carbon footprint with EcoPulse AI! ${report ? `My footprint is ${report.totalTonnesCO2e} tCO₂e/year.` : ''} Join me! 🌿 ${window.location.origin}`
                      );
                      setSnackbar({ open: true, message: '📋 Progress link copied to clipboard! Share it with friends.', severity: 'success' });
                    }
                  }}
                  sx={{
                    background: `linear-gradient(135deg, #2D6A4F, #40916C)`,
                    fontWeight: 700,
                    px: 4,
                    boxShadow: `0 6px 24px ${alpha('#2D6A4F', 0.3)}`,
                    '&:hover': {
                      boxShadow: `0 10px 32px ${alpha('#2D6A4F', 0.4)}`,
                    },
                  }}
                >
                  Share Your Progress
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Snackbar for button feedback */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
              severity={snackbar.severity}
              variant="filled"
              sx={{ borderRadius: 3, fontWeight: 600, width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default CommunityPage;
