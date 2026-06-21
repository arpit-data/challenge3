/**
 * @fileoverview EcoPulse AI — Challenge Center Page.
 * Browse, start, and track eco-challenges.
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Checkbox,
  FormControlLabel,
  useTheme,
  alpha,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Timer as TimerIcon,
  Speed as DifficultyIcon,
  Co2 as CO2Icon,
  CheckCircle as CompletedIcon,
  PlayArrow as StartIcon,
  Close as AbandonIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  pageVariants,
  staggerContainer,
  staggerItem,
  fadeInUp,
  cardVariants,
} from '../theme/animations';
import { useChallengeStore } from '../stores/appStore';
import { BUILT_IN_CHALLENGES } from '../data/challenges';
import { DIFFICULTY_COLORS, CATEGORY_EMOJI } from '../constants/ui';
import { useGlassStyle } from '../hooks/useGlassStyle';
import type { Challenge, ChallengeProgress } from '../types';



// ---- ChallengeCard for available challenges ----

interface AvailableChallengeCardProps {
  challenge: Challenge;
  isStarted: boolean;
  onStart: (id: string) => void;
}

const AvailableChallengeCard = React.memo<AvailableChallengeCardProps>(({ challenge, isStarted, onStart }) => {
  const theme = useTheme();
  const glass = useGlassStyle();
  const diffColor = DIFFICULTY_COLORS[challenge.difficulty] || '#52B788';
  const catEmoji = CATEGORY_EMOJI[challenge.category] || '🌿';

  return (
    <motion.div variants={staggerItem}>
      <Card
        sx={{
          ...glass,
          perspective: '1200px',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-8px) rotateX(-2deg) rotateY(1deg)',
            boxShadow: theme.palette.mode === 'dark'
              ? `0 24px 56px rgba(0,0,0,0.5), inset 0 1px 0 ${alpha('#52B788', 0.1)}`
              : '0 24px 56px rgba(27,67,50,0.14), 0 8px 20px rgba(27,67,50,0.08)',
          },
        }}
      >
        {/* Top gradient accent bar */}
        <Box
          sx={{
            height: 4,
            background: `linear-gradient(90deg, ${diffColor}, ${alpha(diffColor, 0.4)})`,
          }}
        />

        <CardContent sx={{ p: 3 }}>
          {/* Emoji badge */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                background: `linear-gradient(135deg, ${alpha(diffColor, 0.15)}, ${alpha(diffColor, 0.05)})`,
                boxShadow: `0 6px 16px ${alpha(diffColor, 0.2)}`,
                flexShrink: 0,
              }}
            >
              {catEmoji}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.3, mb: 0.5 }}>
                {challenge.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                {challenge.description}
              </Typography>
            </Box>
          </Box>

          {/* Badge row */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2.5 }}>
            <Chip
              icon={<TimerIcon sx={{ fontSize: 16 }} />}
              label={`${challenge.durationDays} days`}
              size="small"
              sx={{
                fontWeight: 600,
                background: alpha(theme.palette.info.main, 0.1),
                color: theme.palette.info.main,
                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
              }}
            />
            <Chip
              icon={<DifficultyIcon sx={{ fontSize: 16 }} />}
              label={challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
              size="small"
              sx={{
                fontWeight: 600,
                background: alpha(diffColor, 0.1),
                color: diffColor,
                border: `1px solid ${alpha(diffColor, 0.2)}`,
              }}
            />
            <Chip
              icon={<CO2Icon sx={{ fontSize: 16 }} />}
              label={`${challenge.co2SavingsKg} kg CO₂`}
              size="small"
              sx={{
                fontWeight: 600,
                background: alpha('#52B788', 0.1),
                color: '#52B788',
                border: `1px solid ${alpha('#52B788', 0.2)}`,
              }}
            />
            <Chip
              label={`Badge: ${challenge.badgeReward}`}
              size="small"
              sx={{
                fontWeight: 600,
                background: alpha('#F9A826', 0.1),
                color: '#F9A826',
                border: `1px solid ${alpha('#F9A826', 0.2)}`,
              }}
            />
          </Box>

          {/* Start button */}
          <Button
            variant="contained"
            fullWidth
            startIcon={isStarted ? <CompletedIcon /> : <StartIcon />}
            disabled={isStarted}
            onClick={() => onStart(challenge.id)}
            id={`start-challenge-${challenge.id}`}
            aria-label={`Start challenge: ${challenge.title}`}
            sx={{
              borderRadius: '14px',
              fontWeight: 700,
              py: 1.2,
              fontSize: '0.95rem',
              boxShadow: isStarted ? 'none' : `0 6px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
              '&.Mui-disabled': {
                background: alpha(theme.palette.success.main, 0.12),
                color: alpha(theme.palette.success.main, 0.6),
              },
            }}
          >
            {isStarted ? 'Already Active' : 'Start Challenge'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
});
AvailableChallengeCard.displayName = 'AvailableChallengeCard';

// ---- ActiveChallengeCard ----

interface ActiveChallengeCardProps {
  challenge: Challenge;
  progress: ChallengeProgress;
  onCompleteDay: (challengeId: string, day: number) => void;
  onAbandon: (challengeId: string) => void;
}

const ActiveChallengeCard = React.memo<ActiveChallengeCardProps>(({ challenge, progress, onCompleteDay, onAbandon }) => {
  const theme = useTheme();
  const glass = useGlassStyle();
  const completedCount = progress.completedDays.length;
  const totalDays = challenge.durationDays;
  const progressPercent = Math.round((completedCount / totalDays) * 100);
  const isComplete = completedCount >= totalDays;

  return (
    <motion.div variants={cardVariants}>
      <Card
        sx={{
          ...glass,
          position: 'relative',
          overflow: 'hidden',
          borderColor: isComplete
            ? alpha('#52B788', 0.4)
            : alpha(theme.palette.primary.main, 0.15),
        }}
      >
        {/* Progress shimmer at top */}
        <Box
          sx={{
            height: 4,
            background: `linear-gradient(90deg, #52B788 ${progressPercent}%, ${alpha('#52B788', 0.15)} ${progressPercent}%)`,
            transition: 'background 0.5s ease',
          }}
        />

        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {challenge.badgeReward} {challenge.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {completedCount}/{totalDays} days completed
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Progress circle */}
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `conic-gradient(#52B788 ${progressPercent * 3.6}deg, ${alpha('#52B788', 0.12)} 0deg)`,
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: theme.palette.background.paper,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.7rem' }}>
                    {progressPercent}%
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Daily tasks */}
          <Divider sx={{ mb: 2, opacity: 0.5 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
            {challenge.tasks.map((task) => {
              const isDayCompleted = progress.completedDays.includes(task.day);
              return (
                <FormControlLabel
                  key={task.day}
                  control={
                    <Checkbox
                      checked={isDayCompleted}
                      onChange={() => !isDayCompleted && onCompleteDay(challenge.id, task.day)}
                      disabled={isDayCompleted}
                      id={`task-${challenge.id}-day-${task.day}`}
                      sx={{
                        color: alpha('#52B788', 0.4),
                        '&.Mui-checked': { color: '#52B788' },
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: isDayCompleted ? 'line-through' : 'none',
                        color: isDayCompleted ? 'text.secondary' : 'text.primary',
                        fontWeight: isDayCompleted ? 400 : 500,
                      }}
                    >
                      <strong>Day {task.day}:</strong> {task.description}
                    </Typography>
                  }
                  sx={{
                    mx: 0,
                    py: 0.5,
                    px: 1,
                    borderRadius: '10px',
                    transition: 'background 0.2s',
                    '&:hover': { background: alpha('#52B788', 0.04) },
                  }}
                />
              );
            })}
          </Box>

          {/* Complete / Abandon */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            {isComplete ? (
              <Chip
                icon={<TrophyIcon />}
                label="Challenge Complete! 🎉"
                color="success"
                sx={{ fontWeight: 700, fontSize: '0.85rem', py: 2 }}
              />
            ) : (
              <Button
                size="small"
                color="error"
                startIcon={<AbandonIcon />}
                onClick={() => onAbandon(challenge.id)}
                id={`abandon-challenge-${challenge.id}`}
                sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, opacity: 0.7, '&:hover': { opacity: 1 } }}
              >
                Abandon
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
});
ActiveChallengeCard.displayName = 'ActiveChallengeCard';

// ---- Main ChallengeCenterPage ----

/** Challenge Center page for browsing, starting, and tracking eco-challenges. */
const ChallengeCenterPage: React.FC = () => {
  const theme = useTheme();
  const { activeProgresses, startChallenge, completeChallengeDay, abandonChallenge } = useChallengeStore();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Derive active / completed / available
  const activeChallenges = useMemo(() =>
    activeProgresses.filter((p) => p.status === 'active'),
    [activeProgresses]
  );

  const completedProgresses = useMemo(() =>
    activeProgresses.filter((p) => {
      const challenge = BUILT_IN_CHALLENGES.find((c) => c.id === p.challengeId);
      return p.status === 'completed' || (challenge && p.completedDays.length >= challenge.durationDays);
    }),
    [activeProgresses]
  );

  const activeIds = useMemo(() =>
    new Set(activeProgresses.map((p) => p.challengeId)),
    [activeProgresses]
  );

  const availableChallenges = useMemo(() =>
    BUILT_IN_CHALLENGES.filter((c) => !activeIds.has(c.id)),
    [activeIds]
  );

  const handleStart = useCallback((id: string) => startChallenge(id), [startChallenge]);
  const handleCompleteDay = useCallback((cid: string, day: number) => completeChallengeDay(cid, day), [completeChallengeDay]);
  const handleAbandon = useCallback((cid: string) => abandonChallenge(cid), [abandonChallenge]);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2, sm: 3 }, py: 3 }}>

        {/* Header */}
        <motion.div variants={fadeInUp}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrophyIcon sx={{ color: 'warning.main', fontSize: 32 }} />
              Challenge Center
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Push yourself with eco-challenges and earn badges
            </Typography>
          </Box>
        </motion.div>

        {/* ---- Active Challenges ---- */}
        {activeChallenges.length > 0 && (
          <motion.div variants={fadeInUp}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              🏃 Active Challenges
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
              {activeChallenges.map((progress) => {
                const challenge = BUILT_IN_CHALLENGES.find((c) => c.id === progress.challengeId);
                if (!challenge) return null;
                return (
                  <ActiveChallengeCard
                    key={progress.challengeId}
                    challenge={challenge}
                    progress={progress}
                    onCompleteDay={handleCompleteDay}
                    onAbandon={handleAbandon}
                  />
                );
              })}
            </Box>
          </motion.div>
        )}

        {/* ---- Completed Challenges ---- */}
        {completedProgresses.length > 0 && (
          <motion.div variants={fadeInUp}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              ✅ Completed
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 4 }}>
              {completedProgresses.map((p) => {
                const ch = BUILT_IN_CHALLENGES.find((c) => c.id === p.challengeId);
                if (!ch) return null;
                return (
                  <motion.div key={p.challengeId} variants={staggerItem}>
                    <Chip
                      label={`${ch.badgeReward} ${ch.title}`}
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        py: 2.5,
                        px: 1,
                        background: `linear-gradient(135deg, ${alpha('#52B788', 0.15)}, ${alpha('#40916C', 0.08)})`,
                        border: `1px solid ${alpha('#52B788', 0.3)}`,
                        color: theme.palette.mode === 'dark' ? '#95D5B2' : '#1B4332',
                        boxShadow: `0 4px 12px ${alpha('#52B788', 0.15)}`,
                      }}
                    />
                    <Button
                      size="small"
                      variant="text"
                      onClick={() => setSnackbarOpen(true)}
                      sx={{ mt: 0.5, textTransform: 'none', fontWeight: 600, fontSize: '0.78rem' }}
                    >
                      View Details
                    </Button>
                  </motion.div>
                );
              })}
            </Box>
          </motion.div>
        )}

        {/* ---- Available Challenges ---- */}
        <motion.div variants={fadeInUp}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            🌟 Available Challenges
          </Typography>
        </motion.div>
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2.5,
              mb: 4,
            }}
          >
            {availableChallenges.map((challenge) => (
              <AvailableChallengeCard
                key={challenge.id}
                challenge={challenge}
                isStarted={activeIds.has(challenge.id)}
                onStart={handleStart}
              />
            ))}
          </Box>
        </motion.div>

        {/* All challenges started */}
        {availableChallenges.length === 0 && (
          <motion.div variants={fadeInUp}>
            <Card
              sx={{
                textAlign: 'center',
                py: 5,
                background: `linear-gradient(145deg, ${alpha(theme.palette.success.main, 0.08)}, ${alpha(theme.palette.success.main, 0.02)})`,
                border: `1px solid ${alpha(theme.palette.success.main, 0.15)}`,
                borderRadius: '20px',
              }}
            >
              <Typography variant="h3" sx={{ mb: 1 }}>🌍</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                You&apos;ve started all challenges!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Complete your active challenges to earn badges.
              </Typography>
            </Card>
          </motion.div>
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="info" sx={{ width: '100%' }}>
            Challenge details view coming soon! 🏆
          </Alert>
        </Snackbar>
      </Box>
    </motion.div>
  );
};

export default ChallengeCenterPage;
