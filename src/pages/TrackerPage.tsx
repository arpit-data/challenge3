// ============================================================
// EcoPulse AI — Tracker Page
// "Every Action Counts" — Track eco actions and challenges
// ============================================================

import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import { alpha, useTheme } from '@mui/material/styles';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import { useCarbonStore, useChallengeStore } from '../stores/appStore';
import { BUILT_IN_CHALLENGES } from '../data/challenges';
import { staggerContainer, staggerItem } from '../theme/animations';
import type { Recommendation, Difficulty, Impact } from '../types';

type FilterType = 'all' | 'easy' | 'high' | 'moderate' | 'advanced';

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All Actions' },
  { key: 'easy', label: 'Low Effort' },
  { key: 'high', label: 'High Impact' },
  { key: 'moderate', label: 'Moderate' },
  { key: 'advanced', label: 'Advanced' },
];

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: '#52B788',
  moderate: '#F9A826',
  advanced: '#E63946',
};

const IMPACT_COLORS: Record<Impact, string> = {
  low: '#90A4AE',
  medium: '#48CAE4',
  high: '#2D6A4F',
};

function getDifficultyLabel(d: Difficulty): string {
  return d === 'easy' ? 'Low Effort' : d === 'moderate' ? 'Moderate' : 'Advanced';
}

export default function TrackerPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const recommendations = useCarbonStore((s) => s.recommendations);
  const completeRecommendation = useCarbonStore((s) => s.completeRecommendation);
  const currentReport = useCarbonStore((s) => s.currentReport);
  const activeProgresses = useChallengeStore((s) => s.activeProgresses);
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredRecs = useMemo(() => {
    if (filter === 'all') return recommendations;
    if (filter === 'high') return recommendations.filter((r) => r.impact === 'high');
    return recommendations.filter((r) => r.difficulty === filter);
  }, [recommendations, filter]);

  const totalSaved = useMemo(
    () => recommendations.filter((r) => r.completed).reduce((s, r) => s + r.estimatedReductionKg, 0),
    [recommendations]
  );

  const weeklyTarget = 75;

  const handleComplete = useCallback(
    (id: string) => {
      completeRecommendation(id);
    },
    [completeRecommendation]
  );

  // No assessment state
  if (!currentReport && recommendations.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ fontSize: 80, mb: 3 }}>🌱</Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
            Start Your Journey
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 4, maxWidth: 400, mx: 'auto' }}>
            Complete your carbon footprint assessment to unlock personalized eco actions and challenges.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/assessment')}
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{ borderRadius: 3, px: 5, py: 1.5 }}
            id="tracker-start-assessment"
          >
            Take Assessment
          </Button>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box>
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            textAlign: 'center',
            mb: 1,
            fontSize: { xs: '2rem', md: '2.8rem' },
            letterSpacing: '-0.02em',
          }}
        >
          Every Action Counts.
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            color: theme.palette.text.secondary,
            maxWidth: 550,
            mx: 'auto',
            mb: 4,
            lineHeight: 1.7,
          }}
        >
          Track your daily and weekly challenges. See your immediate environmental impact grow with every small step.
        </Typography>
      </motion.div>

      {/* Weekly Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Card
          sx={{
            mb: 4,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.04)}, ${alpha(theme.palette.secondary.main, 0.04)})`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            p: { xs: 2.5, md: 3.5 },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Total CO₂ Saved this Week
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {totalSaved > 0
                  ? "You're making a real difference. Keep going!"
                  : 'Complete actions below to start saving CO₂!'}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  color: theme.palette.primary.main,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                }}
              >
                {totalSaved}
                <Typography component="span" variant="body1" sx={{ fontWeight: 500, ml: 0.5 }}>
                  kg
                </Typography>
              </Typography>
            </Box>
          </Box>

          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mb: 0.5, display: 'block', textAlign: 'right' }}>
            Target: {weeklyTarget}kg
          </Typography>
          <LinearProgress
            variant="determinate"
            value={Math.min(100, (totalSaved / weeklyTarget) * 100)}
            aria-label={`Weekly CO₂ savings progress: ${totalSaved} of ${weeklyTarget} kg`}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Card>
      </motion.div>

      {/* Filter Chips */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }} role="group" aria-label="Filter options">
        {FILTERS.map((f) => (
          <Chip
            key={f.key}
            label={f.label}
            onClick={() => setFilter(f.key)}
            id={`filter-${f.key}`}
            aria-pressed={filter === f.key}
            variant={filter === f.key ? 'filled' : 'outlined'}
            sx={{
              fontWeight: 600,
              borderRadius: 3,
              transition: 'all 0.2s',
              ...(filter === f.key
                ? {
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                    color: '#fff',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                  }
                : {
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                    '&:hover': {
                      background: alpha(theme.palette.primary.main, 0.06),
                    },
                  }),
            }}
          />
        ))}
      </Box>

      {/* Action Cards */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate">
        <Grid container spacing={2.5}>
          {filteredRecs.map((rec) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={rec.id}>
              <ActionCard rec={rec} onComplete={handleComplete} />
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {filteredRecs.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
            No actions match this filter. Try another category!
          </Typography>
        </Box>
      )}

      {/* Active Challenges */}
      {activeProgresses.filter((p) => p.status === 'active').length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmojiEventsRoundedIcon sx={{ color: theme.palette.warning.main }} />
            Active Challenges
          </Typography>
          <Grid container spacing={2}>
            {activeProgresses
              .filter((p) => p.status === 'active')
              .map((progress) => {
                const challenge = BUILT_IN_CHALLENGES.find((c) => c.id === progress.challengeId);
                if (!challenge) return null;
                const completed = progress.completedDays.length;
                return (
                  <Grid size={{ xs: 12, sm: 6 }} key={progress.challengeId}>
                    <Card sx={{ p: 2.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          {challenge.badgeReward} {challenge.title}
                        </Typography>
                        <Chip
                          label={`${completed}/${challenge.durationDays} days`}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            background: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                          }}
                        />
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(completed / challenge.durationDays) * 100}
                        aria-label={`${challenge.title} progress: ${completed} of ${challenge.durationDays} days`}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Card>
                  </Grid>
                );
              })}
          </Grid>
        </Box>
      )}
    </Box>
  );
}

// ---- Action Card Component ----

interface ActionCardProps {
  rec: Recommendation;
  onComplete: (id: string) => void;
}

function ActionCard({ rec, onComplete }: ActionCardProps) {
  const theme = useTheme();

  return (
    <motion.div variants={staggerItem}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          p: 0,
          overflow: 'visible',
          position: 'relative',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: `0 16px 40px ${alpha(theme.palette.primary.main, 0.12)}`,
          },
          ...(rec.completed && {
            opacity: 0.75,
            border: `2px solid ${theme.palette.success.main}`,
          }),
        }}
      >
        <CardContent sx={{ flex: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
          {/* Header: badge + impact */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Chip
              label={getDifficultyLabel(rec.difficulty)}
              size="small"
              icon={
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: DIFFICULTY_COLORS[rec.difficulty],
                    ml: 0.5,
                  }}
                />
              }
              sx={{
                fontWeight: 600,
                fontSize: '0.7rem',
                background: alpha(DIFFICULTY_COLORS[rec.difficulty], 0.1),
                color: DIFFICULTY_COLORS[rec.difficulty],
                border: `1px solid ${alpha(DIFFICULTY_COLORS[rec.difficulty], 0.2)}`,
              }}
            />
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                color: IMPACT_COLORS[rec.impact],
              }}
            >
              +{rec.estimatedReductionKg}kg CO₂
            </Typography>
          </Box>

          {/* Title */}
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
            {rec.title}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary, lineHeight: 1.6, mb: 2, flex: 1 }}
          >
            {rec.description}
          </Typography>

          {/* Action Button */}
          <AnimatePresence mode="wait">
            {rec.completed ? (
              <motion.div
                key="completed"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<CheckCircleRoundedIcon />}
                  disabled
                  id={`action-completed-${rec.id}`}
                  sx={{
                    borderRadius: 3,
                    py: 1.2,
                    background: `${theme.palette.success.main} !important`,
                    color: '#fff !important',
                    fontWeight: 700,
                    opacity: '1 !important',
                  }}
                >
                  Completed
                </Button>
              </motion.div>
            ) : (
              <motion.div key="action" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => onComplete(rec.id)}
                  id={`action-complete-${rec.id}`}
                  sx={{
                    borderRadius: 3,
                    py: 1.2,
                    fontWeight: 600,
                    borderColor: alpha(theme.palette.text.primary, 0.15),
                    color: theme.palette.text.primary,
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      background: alpha(theme.palette.primary.main, 0.04),
                    },
                  }}
                >
                  Complete Action
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
