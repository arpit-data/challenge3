// ============================================================
// EcoPulse AI — Achievements Page
// Badge collection with locked/unlocked states & tier system
// ============================================================

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Lock as LockIcon,
  EmojiEvents as TrophyIcon,
  CalendarToday as DateIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  pageVariants,
  staggerContainer,
  staggerItem,
  fadeInUp,
  badgeUnlockVariants,
} from '../theme/animations';
import { useAchievementStore } from '../stores/appStore';
import { BUILT_IN_ACHIEVEMENTS } from '../data/achievements';
import type { Achievement } from '../types';

// ---- Tier configuration ----

const TIER_CONFIG: Record<Achievement['tier'], { color: string; gradient: string; label: string; glow: string }> = {
  bronze:   { color: '#CD7F32', gradient: 'linear-gradient(135deg, #CD7F32, #A0522D)', label: 'Bronze',   glow: '0 0 20px rgba(205,127,50,0.35)' },
  silver:   { color: '#C0C0C0', gradient: 'linear-gradient(135deg, #C0C0C0, #A8A8A8)', label: 'Silver',   glow: '0 0 20px rgba(192,192,192,0.35)' },
  gold:     { color: '#FFD700', gradient: 'linear-gradient(135deg, #FFD700, #DAA520)', label: 'Gold',     glow: '0 0 20px rgba(255,215,0,0.4)' },
  platinum: { color: '#E5E4E2', gradient: 'linear-gradient(135deg, #E5E4E2, #B4C7DC)', label: 'Platinum', glow: '0 0 24px rgba(180,199,220,0.5)' },
};

// ---- Badge Card ----

interface BadgeCardProps {
  achievement: Achievement;
  unlocked: boolean;
  unlockDate?: string;
  onClick: (a: Achievement) => void;
}

const BadgeCard = React.memo<BadgeCardProps>(({ achievement, unlocked, unlockDate, onClick }) => {
  const theme = useTheme();
  const tier = TIER_CONFIG[achievement.tier];

  return (
    <motion.div variants={staggerItem}>
      <Card
        onClick={() => onClick(achievement)}
        role="button"
        tabIndex={0}
        aria-label={`${unlocked ? 'Unlocked' : 'Locked'} achievement: ${achievement.title}`}
        id={`badge-${achievement.id}`}
        onKeyDown={(e) => e.key === 'Enter' && onClick(achievement)}
        sx={{
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
          py: 3,
          px: 2,
          minHeight: 180,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20px',
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(145deg, ${alpha('#1A2940', 0.85)}, ${alpha('#121E32', 0.65)})`
            : `linear-gradient(145deg, ${alpha('#FFFFFF', 0.92)}, ${alpha('#F0F7F4', 0.7)})`,
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: unlocked
            ? `2px solid ${alpha(tier.color, 0.5)}`
            : `1px solid ${alpha(theme.palette.divider, 0.15)}`,
          boxShadow: unlocked
            ? `${tier.glow}, 0 8px 32px rgba(0,0,0,0.1)`
            : '0 4px 16px rgba(0,0,0,0.06)',
          filter: unlocked ? 'none' : 'grayscale(0.85)',
          transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
          '&:hover': {
            transform: unlocked
              ? 'translateY(-6px) rotateY(5deg) scale(1.03)'
              : 'translateY(-3px) scale(1.02)',
            boxShadow: unlocked
              ? `${tier.glow.replace('20px', '32px')}, 0 16px 48px rgba(0,0,0,0.15)`
              : '0 8px 24px rgba(0,0,0,0.1)',
            filter: unlocked ? 'none' : 'grayscale(0.5)',
          },
          perspective: '800px',
        }}
      >
        {/* Tier ribbon */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: unlocked ? tier.gradient : alpha(theme.palette.divider, 0.2),
            borderRadius: '20px 20px 0 0',
          }}
        />

        {/* Badge icon */}
        <motion.div
          variants={unlocked ? badgeUnlockVariants : undefined}
          initial={unlocked ? 'initial' : undefined}
          animate={unlocked ? 'animate' : undefined}
        >
          <Box
            sx={{
              position: 'relative',
              width: 64,
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1.5,
            }}
          >
            <Typography
              variant="h2"
              component="span"
              sx={{
                fontSize: '2.5rem',
                lineHeight: 1,
                filter: unlocked ? 'none' : 'blur(3px) opacity(0.5)',
                transition: 'filter 0.3s',
              }}
            >
              {achievement.icon}
            </Typography>
            {/* Lock overlay */}
            {!unlocked && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LockIcon
                  sx={{
                    fontSize: 24,
                    color: alpha(theme.palette.text.secondary, 0.5),
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                  }}
                />
              </Box>
            )}
          </Box>
        </motion.div>

        {/* Title */}
        <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.3, mb: 0.5 }}>
          {achievement.title}
        </Typography>

        {/* Tier chip */}
        <Chip
          label={tier.label}
          size="small"
          sx={{
            fontWeight: 700,
            fontSize: '0.65rem',
            height: 22,
            background: unlocked ? alpha(tier.color, 0.15) : alpha(theme.palette.divider, 0.1),
            color: unlocked ? tier.color : theme.palette.text.secondary,
            border: `1px solid ${unlocked ? alpha(tier.color, 0.3) : 'transparent'}`,
          }}
        />

        {/* Unlock date */}
        {unlocked && unlockDate && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.6rem' }}>
            {new Date(unlockDate).toLocaleDateString()}
          </Typography>
        )}
      </Card>
    </motion.div>
  );
});
BadgeCard.displayName = 'BadgeCard';

// ---- Main AchievementsPage ----

const AchievementsPage: React.FC = () => {
  const theme = useTheme();
  const { unlockedAchievements, checkAndUnlock } = useAchievementStore();
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  // Check for newly unlockable achievements on mount
  useEffect(() => {
    checkAndUnlock();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Build a lookup for unlocked achievements
  const unlockedMap = useMemo(() => {
    const map = new Map<string, Achievement>();
    unlockedAchievements.forEach((a) => map.set(a.id, a));
    return map;
  }, [unlockedAchievements]);

  const unlockedCount = unlockedAchievements.length;
  const totalCount = BUILT_IN_ACHIEVEMENTS.length;

  const handleBadgeClick = useCallback((a: Achievement) => setSelectedAchievement(a), []);
  const handleCloseDetail = useCallback(() => setSelectedAchievement(null), []);

  // Selected badge detail
  const selectedUnlocked = selectedAchievement ? unlockedMap.get(selectedAchievement.id) : null;
  const selectedTier = selectedAchievement ? TIER_CONFIG[selectedAchievement.tier] : null;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2, sm: 3 }, py: 3 }}>

        {/* Header */}
        <motion.div variants={fadeInUp}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrophyIcon sx={{ color: 'warning.main', fontSize: 32 }} />
              Achievements
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Collect badges by taking sustainable actions
            </Typography>
          </Box>
        </motion.div>

        {/* Stats row */}
        <motion.div variants={fadeInUp}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 3,
              mt: 2,
              p: 2,
              borderRadius: '16px',
              background: theme.palette.mode === 'dark'
                ? alpha('#1A2940', 0.6)
                : alpha('#FFFFFF', 0.8),
              backdropFilter: 'blur(16px)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '14px',
                background: `linear-gradient(135deg, ${alpha('#FFD700', 0.2)}, ${alpha('#DAA520', 0.1)})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}
            >
              🏅
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {unlockedCount}
                <Typography component="span" variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                  {' '}/{' '}{totalCount}
                </Typography>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Badges unlocked
              </Typography>
            </Box>
            {/* Progress bar */}
            <Box sx={{ flex: 1, ml: 2 }}>
              <Box
                sx={{
                  height: 8,
                  borderRadius: 4,
                  background: alpha(theme.palette.primary.main, 0.1),
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: `${(unlockedCount / totalCount) * 100}%`,
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, #FFD700, #52B788)',
                    transition: 'width 0.8s ease',
                  }}
                />
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Encouragement for few unlocks */}
        {unlockedCount < 3 && (
          <motion.div variants={fadeInUp}>
            <Box
              sx={{
                p: 2.5,
                mb: 3,
                borderRadius: '16px',
                background: `linear-gradient(135deg, ${alpha('#48CAE4', 0.08)}, ${alpha('#52B788', 0.06)})`,
                border: `1px solid ${alpha('#48CAE4', 0.15)}`,
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                🌿 Keep going! Complete your assessment, set goals, and take on challenges to unlock more badges.
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Badge Grid */}
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
              },
              gap: 2,
            }}
          >
            {BUILT_IN_ACHIEVEMENTS.map((achievement) => {
              const unlockedVersion = unlockedMap.get(achievement.id);
              return (
                <BadgeCard
                  key={achievement.id}
                  achievement={achievement}
                  unlocked={!!unlockedVersion}
                  unlockDate={unlockedVersion?.unlockedAt}
                  onClick={handleBadgeClick}
                />
              );
            })}
          </Box>
        </motion.div>

        {/* ---- Achievement Detail Dialog ---- */}
        <AnimatePresence>
          {selectedAchievement && selectedTier && (
            <Dialog
              open
              onClose={handleCloseDetail}
              maxWidth="xs"
              fullWidth
              slotProps={{
                paper: {
                  sx: {
                    borderRadius: '24px',
                    background: theme.palette.mode === 'dark'
                      ? `linear-gradient(145deg, ${alpha('#1A2940', 0.95)}, ${alpha('#121E32', 0.9)})`
                      : `linear-gradient(145deg, ${alpha('#FFFFFF', 0.97)}, ${alpha('#F0F7F4', 0.9)})`,
                    backdropFilter: 'blur(24px)',
                    border: selectedUnlocked
                      ? `2px solid ${alpha(selectedTier.color, 0.4)}`
                      : `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    boxShadow: selectedUnlocked
                      ? `${selectedTier.glow}, 0 24px 64px rgba(0,0,0,0.2)`
                      : '0 16px 48px rgba(0,0,0,0.15)',
                    overflow: 'visible',
                  },
                },
              }}
            >
              <DialogTitle sx={{ textAlign: 'center', pt: 4, pb: 0 }}>
                {/* Large badge icon */}
                <motion.div
                  initial={{ scale: 0, rotateY: -180 }}
                  animate={{ scale: 1, rotateY: 0 }}
                  transition={{ type: 'spring', stiffness: 250, damping: 18 }}
                >
                  <Typography
                    variant="h1"
                    component="div"
                    sx={{
                      fontSize: '4rem',
                      lineHeight: 1,
                      mb: 1,
                      filter: selectedUnlocked ? 'none' : 'grayscale(1) blur(3px) opacity(0.4)',
                    }}
                  >
                    {selectedAchievement.icon}
                  </Typography>
                </motion.div>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {selectedAchievement.title}
                </Typography>
                <Chip
                  label={selectedTier.label}
                  size="small"
                  sx={{
                    mt: 1,
                    fontWeight: 700,
                    background: alpha(selectedTier.color, 0.15),
                    color: selectedTier.color,
                    border: `1px solid ${alpha(selectedTier.color, 0.3)}`,
                  }}
                />
              </DialogTitle>

              <DialogContent sx={{ textAlign: 'center', pt: 2 }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {selectedAchievement.description}
                </Typography>

                {/* Criteria */}
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    background: alpha(theme.palette.primary.main, 0.06),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    mb: 2,
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    How to unlock
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {selectedAchievement.criteria}
                  </Typography>
                </Box>

                {/* Unlock date */}
                {selectedUnlocked?.unlockedAt && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                    <DateIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      Unlocked on {new Date(selectedUnlocked.unlockedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
                  </Box>
                )}

                {!selectedUnlocked && (
                  <Chip
                    icon={<LockIcon sx={{ fontSize: 14 }} />}
                    label="Locked"
                    size="small"
                    sx={{
                      fontWeight: 600,
                      background: alpha(theme.palette.text.secondary, 0.08),
                      color: 'text.secondary',
                    }}
                  />
                )}
              </DialogContent>

              <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button
                  onClick={handleCloseDetail}
                  variant="outlined"
                  id="close-achievement-detail"
                  sx={{ borderRadius: '12px', px: 4, fontWeight: 600 }}
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </AnimatePresence>
      </Box>
    </motion.div>
  );
};

export default AchievementsPage;
