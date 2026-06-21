// ============================================================
// EcoPulse AI — Goals Page
// Track personal sustainability goals with streaks & check-ins
// ============================================================

import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  CheckCircleOutlined as CheckIcon,
  DirectionsCar as TransportIcon,
  Restaurant as FoodIcon,
  Bolt as EnergyIcon,
  Delete as WasteIcon,
  WaterDrop as WaterIcon,
  ShoppingBag as ShoppingIcon,
  Flight as TravelIcon,
  EmojiEvents as TrophyIcon,
  Pause as PauseIcon,
  PlayArrow as PlayIcon,
  DeleteOutlined as RemoveIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  pageVariants,
  staggerContainer,
  staggerItem,
  fadeInUp,
} from '../theme/animations';
import { useGoalStore } from '../stores/appStore';
import type { CarbonCategory, Goal } from '../types';

// ---- Category helpers ----

const CATEGORY_CONFIG: Record<CarbonCategory, { icon: React.ReactElement; color: string; label: string }> = {
  transportation: { icon: <TransportIcon />, color: '#48CAE4', label: 'Transportation' },
  food:           { icon: <FoodIcon />,      color: '#52B788', label: 'Food' },
  energy:         { icon: <EnergyIcon />,    color: '#F9A826', label: 'Energy' },
  waste:          { icon: <WasteIcon />,      color: '#74C69D', label: 'Waste' },
  water:          { icon: <WaterIcon />,      color: '#0096C7', label: 'Water' },
  shopping:       { icon: <ShoppingIcon />,   color: '#FF6B6B', label: 'Shopping' },
  travel:         { icon: <TravelIcon />,     color: '#90E0EF', label: 'Travel' },
};

// ---- Pre-built goal suggestions ----

interface GoalSuggestion {
  title: string;
  description: string;
  category: CarbonCategory;
  targetFrequency: string;
  emoji: string;
}

const GOAL_SUGGESTIONS: GoalSuggestion[] = [
  { title: 'Meatless Mondays', description: 'Skip meat every Monday to reduce food-related emissions.', category: 'food', targetFrequency: 'Weekly', emoji: '🥦' },
  { title: 'Public Transit Twice Weekly', description: 'Take public transit at least twice per week instead of driving.', category: 'transportation', targetFrequency: 'Weekly', emoji: '🚌' },
  { title: 'Reduce Electricity 10%', description: 'Cut your monthly electricity usage by 10% through mindful habits.', category: 'energy', targetFrequency: 'Monthly', emoji: '💡' },
  { title: 'Recycle Consistently', description: 'Sort and recycle all recyclable materials every day.', category: 'waste', targetFrequency: 'Daily', emoji: '♻️' },
  { title: 'Shorter Showers', description: 'Keep showers under 5 minutes to save water and energy.', category: 'water', targetFrequency: 'Daily', emoji: '🚿' },
];

// ---- Glassmorphism card styling ----

const useGlassCard = () => {
  const theme = useTheme();
  return useMemo(() => ({
    background: theme.palette.mode === 'dark'
      ? `linear-gradient(145deg, ${alpha('#1A2940', 0.85)}, ${alpha('#121E32', 0.65)})`
      : `linear-gradient(145deg, ${alpha('#FFFFFF', 0.9)}, ${alpha('#F0F7F4', 0.7)})`,
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: `1px solid ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.15 : 0.1)}`,
    borderRadius: '20px',
    boxShadow: theme.palette.mode === 'dark'
      ? `0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 ${alpha('#52B788', 0.06)}`
      : '0 8px 32px rgba(27,67,50,0.08), 0 2px 8px rgba(27,67,50,0.04)',
    transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
  }), [theme]);
};

// ---- GoalCard component ----

interface GoalCardProps {
  goal: Goal;
  onCheckin: (id: string) => void;
  onPause: (id: string) => void;
  onRemove: (id: string) => void;
}

const GoalCard = React.memo<GoalCardProps>(({ goal, onCheckin, onPause, onRemove }) => {
  const theme = useTheme();
  const glass = useGlassCard();
  const config = CATEGORY_CONFIG[goal.category];

  // Check if already checked in today
  const today = new Date().toISOString().split('T')[0];
  const checkedInToday = goal.checkins.some(
    (c) => c.date.split('T')[0] === today && c.completed
  );

  return (
    <motion.div variants={staggerItem}>
      <Card
        sx={{
          ...glass,
          perspective: '1000px',
          position: 'relative',
          overflow: 'visible',
          '&:hover': {
            transform: 'translateY(-6px) rotateX(-1deg)',
            boxShadow: theme.palette.mode === 'dark'
              ? `0 20px 48px rgba(0,0,0,0.5), inset 0 1px 0 ${alpha('#52B788', 0.12)}`
              : `0 20px 48px rgba(27,67,50,0.14), 0 8px 16px rgba(27,67,50,0.08)`,
            borderColor: alpha(config.color, 0.3),
          },
        }}
      >
        {/* Streak glow accent */}
        {goal.streak >= 3 && (
          <Box
            sx={{
              position: 'absolute',
              top: -2,
              left: '10%',
              right: '10%',
              height: '4px',
              background: `linear-gradient(90deg, transparent, ${config.color}, transparent)`,
              borderRadius: '4px',
              filter: 'blur(1px)',
            }}
          />
        )}

        <CardContent sx={{ p: 2.5 }}>
          {/* Header row: icon, title, actions */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
            {/* Category icon */}
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${alpha(config.color, 0.2)}, ${alpha(config.color, 0.08)})`,
                color: config.color,
                flexShrink: 0,
                boxShadow: `0 4px 12px ${alpha(config.color, 0.2)}`,
              }}
            >
              {config.icon}
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {goal.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {goal.description}
              </Typography>
            </Box>

            {/* Action buttons */}
            <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
              <IconButton
                size="small"
                onClick={() => onPause(goal.id)}
                aria-label={goal.status === 'paused' ? 'Resume goal' : 'Pause goal'}
                id={`goal-pause-${goal.id}`}
                sx={{ color: 'text.secondary' }}
              >
                {goal.status === 'paused' ? <PlayIcon fontSize="small" /> : <PauseIcon fontSize="small" />}
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onRemove(goal.id)}
                aria-label="Remove goal"
                id={`goal-remove-${goal.id}`}
                sx={{ color: 'error.main', opacity: 0.6, '&:hover': { opacity: 1 } }}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Progress bar */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 600 }} color="primary">
                {goal.progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={goal.progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: alpha(config.color, 0.12),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${config.color}, ${alpha(config.color, 0.7)})`,
                },
              }}
            />
          </Box>

          {/* Streak & check-in row */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Streak counter */}
            <motion.div
              key={goal.streak}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="h6" component="span" sx={{ lineHeight: 1 }}>
                  🔥
                </Typography>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2 }} color="text.primary">
                    {goal.streak} day{goal.streak !== 1 ? 's' : ''}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                    Best: {goal.bestStreak}
                  </Typography>
                </Box>
              </Box>
            </motion.div>

            {/* Frequency badge */}
            <Chip
              label={goal.targetFrequency}
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: '0.7rem',
                background: alpha(config.color, 0.1),
                color: config.color,
                border: `1px solid ${alpha(config.color, 0.2)}`,
              }}
            />

            {/* Check-in button */}
            <Button
              variant="contained"
              size="small"
              startIcon={<CheckIcon />}
              disabled={checkedInToday || goal.status === 'paused'}
              onClick={() => onCheckin(goal.id)}
              id={`goal-checkin-${goal.id}`}
              aria-label={`Check in for ${goal.title}`}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 700,
                px: 2,
                background: checkedInToday
                  ? alpha(config.color, 0.15)
                  : `linear-gradient(135deg, ${config.color}, ${alpha(config.color, 0.8)})`,
                color: checkedInToday ? config.color : '#fff',
                boxShadow: checkedInToday
                  ? 'none'
                  : `0 4px 16px ${alpha(config.color, 0.35)}`,
                '&:hover': {
                  boxShadow: `0 6px 20px ${alpha(config.color, 0.45)}`,
                },
                '&.Mui-disabled': {
                  background: alpha(config.color, 0.12),
                  color: alpha(config.color, 0.5),
                },
              }}
            >
              {checkedInToday ? 'Done ✓' : 'Check In'}
            </Button>
          </Box>

          {/* Paused overlay */}
          {goal.status === 'paused' && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                borderRadius: '20px',
                background: alpha(theme.palette.background.default, 0.5),
                backdropFilter: 'blur(2px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Chip label="⏸ Paused" sx={{ fontWeight: 700 }} />
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});
GoalCard.displayName = 'GoalCard';

// ---- Main GoalsPage ----

const GoalsPage: React.FC = () => {
  const theme = useTheme();
  const glass = useGlassCard();
  const { goals, addGoal, checkinGoal, pauseGoal, removeGoal } = useGoalStore();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<CarbonCategory>('food');
  const [newFrequency, setNewFrequency] = useState('Daily');

  const activeGoals = useMemo(() => goals.filter((g) => g.status !== 'completed'), [goals]);

  const handleAddGoal = useCallback(() => {
    if (!newTitle.trim()) return;
    addGoal({
      title: newTitle.trim(),
      description: newDescription.trim(),
      category: newCategory,
      targetFrequency: newFrequency,
      startDate: new Date().toISOString(),
    });
    setNewTitle('');
    setNewDescription('');
    setNewCategory('food');
    setNewFrequency('Daily');
    setDialogOpen(false);
  }, [newTitle, newDescription, newCategory, newFrequency, addGoal]);

  const handleAddSuggestion = useCallback((s: GoalSuggestion) => {
    addGoal({
      title: s.title,
      description: s.description,
      category: s.category,
      targetFrequency: s.targetFrequency,
      startDate: new Date().toISOString(),
    });
  }, [addGoal]);

  const handleCheckin = useCallback((id: string) => checkinGoal(id), [checkinGoal]);
  const handlePause = useCallback((id: string) => pauseGoal(id), [pauseGoal]);
  const handleRemove = useCallback((id: string) => removeGoal(id), [removeGoal]);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <Box sx={{ maxWidth: 800, mx: 'auto', px: { xs: 2, sm: 3 }, py: 3 }}>

        {/* ---- Header ---- */}
        <motion.div variants={fadeInUp}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrophyIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                Your Goals
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Build sustainable habits with daily streaks
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
              id="add-goal-button"
              aria-label="Add new goal"
              sx={{
                borderRadius: '14px',
                px: 3,
                fontWeight: 700,
                boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              Add Goal
            </Button>
          </Box>
        </motion.div>

        {/* ---- Active Goals List ---- */}
        {activeGoals.length > 0 ? (
          <motion.div variants={staggerContainer} initial="initial" animate="animate">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
              <AnimatePresence mode="popLayout">
                {activeGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onCheckin={handleCheckin}
                    onPause={handlePause}
                    onRemove={handleRemove}
                  />
                ))}
              </AnimatePresence>
            </Box>
          </motion.div>
        ) : (
          /* ---- Empty state ---- */
          <motion.div variants={fadeInUp}>
            <Card sx={{ ...glass, textAlign: 'center', py: 6, mb: 4 }}>
              <CardContent>
                <Typography variant="h1" sx={{ fontSize: '3.5rem', mb: 1 }}>
                  🎯
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
                  No goals yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 340, mx: 'auto', mb: 2 }}>
                  Set your first sustainability goal and start building eco-friendly habits with daily streaks!
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setDialogOpen(true)}
                  id="add-goal-empty-button"
                  sx={{ borderRadius: '14px', px: 3 }}
                >
                  Create Your First Goal
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ---- Goal Suggestions ---- */}
        <motion.div variants={fadeInUp}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            💡 Suggested Goals
          </Typography>
        </motion.div>
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 4 }}>
            {GOAL_SUGGESTIONS.map((suggestion) => {
              const config = CATEGORY_CONFIG[suggestion.category];
              const alreadyAdded = goals.some((g) => g.title === suggestion.title);
              return (
                <motion.div key={suggestion.title} variants={staggerItem}>
                  <Card
                    sx={{
                      ...glass,
                      cursor: alreadyAdded ? 'default' : 'pointer',
                      opacity: alreadyAdded ? 0.55 : 1,
                      '&:hover': alreadyAdded ? {} : {
                        transform: 'translateY(-4px) scale(1.01)',
                        borderColor: alpha(config.color, 0.3),
                      },
                    }}
                    onClick={() => !alreadyAdded && handleAddSuggestion(suggestion)}
                    role="button"
                    tabIndex={alreadyAdded ? -1 : 0}
                    aria-label={`Add goal: ${suggestion.title}`}
                    id={`suggestion-${suggestion.title.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography variant="h5" component="span" sx={{ lineHeight: 1 }}>
                          {suggestion.emoji}
                        </Typography>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {suggestion.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3 }}>
                            {suggestion.description}
                          </Typography>
                        </Box>
                        {alreadyAdded ? (
                          <Chip label="Added" size="small" color="success" sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
                        ) : (
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); if (!alreadyAdded) handleAddSuggestion(suggestion); }}
                            sx={{
                              background: alpha(config.color, 0.1),
                              color: config.color,
                              '&:hover': { background: alpha(config.color, 0.2) },
                            }}
                            aria-label={`Quick add ${suggestion.title}`}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </Box>
        </motion.div>

        {/* ---- Add Goal Dialog ---- */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          slotProps={{
            paper: {
              sx: {
                ...glass,
                borderRadius: '24px',
                p: 1,
              },
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 800, pb: 0 }}>
            🎯 New Goal
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Goal Title"
              fullWidth
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              id="new-goal-title"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={2}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              id="new-goal-description"
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="goal-category-label">Category</InputLabel>
                <Select
                  labelId="goal-category-label"
                  value={newCategory}
                  label="Category"
                  onChange={(e) => setNewCategory(e.target.value as CarbonCategory)}
                  id="new-goal-category"
                >
                  {Object.entries(CATEGORY_CONFIG).map(([key, val]) => (
                    <MenuItem key={key} value={key}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ color: val.color, display: 'flex' }}>{val.icon}</Box>
                        {val.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="goal-frequency-label">Frequency</InputLabel>
                <Select
                  labelId="goal-frequency-label"
                  value={newFrequency}
                  label="Frequency"
                  onChange={(e) => setNewFrequency(e.target.value)}
                  id="new-goal-frequency"
                >
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDialogOpen(false)} id="cancel-goal-button">
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddGoal}
              disabled={!newTitle.trim()}
              id="save-goal-button"
              sx={{ borderRadius: '12px', px: 3, fontWeight: 700 }}
            >
              Add Goal
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </motion.div>
  );
};

export default GoalsPage;
