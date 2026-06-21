// ============================================================
// EcoPulse AI — Impact Breakdown Page
// Deep-dive into each carbon category with 3D card flip effects
// ============================================================

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  IconButton,
  Collapse,
  useTheme,
  alpha,

  Button,
} from '@mui/material';
import {
  ArrowBackRounded as BackIcon,
  ExpandMoreRounded as ExpandIcon,
  TrendingDownRounded as TrendingDownIcon,
  InfoOutlined as InfoIcon,
  SavingsRounded as SavingsIcon,
  WarningAmberRounded as WarningIcon,
  CheckCircleOutlineRounded as CheckIcon,
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
import type { CategoryBreakdown, CarbonCategory } from '../types';
import {
  pageVariants,
  staggerContainer,
  staggerItem,
} from '../theme/animations';

// ---- Category Detail Data ----

const CATEGORY_DETAILS: Record<
  CarbonCategory,
  {
    whyItMatters: string;
    potentialReductions: string[];
    avgKg: number; // national average per category
    tip: string;
  }
> = {
  transportation: {
    whyItMatters:
      'Transportation accounts for ~16% of global greenhouse gas emissions. Fuel combustion in cars releases CO₂ directly into the atmosphere.',
    potentialReductions: [
      'Carpool or use public transit 3 days/week',
      'Switch to an EV or hybrid vehicle',
      'Cycle or walk for trips under 5 km',
    ],
    avgKg: 1800,
    tip: 'A single round-trip transatlantic flight emits ~1.6 tonnes CO₂ — equivalent to driving 6,000 km.',
  },
  food: {
    whyItMatters:
      'Food systems contribute ~26% of global emissions through agriculture, transport, and waste decomposition in landfills.',
    potentialReductions: [
      'Adopt plant-based meals 3+ days/week',
      'Buy local and seasonal produce',
      'Reduce food waste by meal planning',
    ],
    avgKg: 1500,
    tip: 'Producing 1 kg of beef generates ~60 kg of CO₂e, while 1 kg of lentils generates only ~0.9 kg.',
  },
  energy: {
    whyItMatters:
      'Home energy use — heating, cooling, lighting — relies heavily on fossil fuels in many regions, making it a top emission source.',
    potentialReductions: [
      'Switch to LED lighting throughout your home',
      'Improve insulation and seal air leaks',
      'Consider renewable energy sources (solar panels)',
    ],
    avgKg: 1400,
    tip: 'Smart thermostats can reduce heating/cooling costs by 10-15% and cut hundreds of kg of CO₂ per year.',
  },
  shopping: {
    whyItMatters:
      'Manufacturing consumer goods requires massive energy, raw materials, and transportation — each product has a hidden carbon cost.',
    potentialReductions: [
      'Buy secondhand clothing and electronics',
      'Choose durable, repairable products',
      'Consolidate online orders to reduce packaging',
    ],
    avgKg: 800,
    tip: 'Extending the life of electronics by just 1 year can save 300+ kg of CO₂ per device.',
  },
  waste: {
    whyItMatters:
      'Decomposing waste in landfills produces methane, a greenhouse gas 80× more potent than CO₂ over 20 years.',
    potentialReductions: [
      'Recycle consistently (paper, plastic, metals)',
      'Start a home composting system',
      'Eliminate single-use plastics',
    ],
    avgKg: 500,
    tip: 'Composting food waste at home can divert 150+ kg of waste from landfills each year.',
  },
  travel: {
    whyItMatters:
      'Aviation is one of the fastest-growing emission sources. A single long-haul flight can exceed many people\'s annual carbon budget.',
    potentialReductions: [
      'Replace one domestic flight with train travel',
      'Choose direct flights to avoid layovers',
      'Offset unavoidable flights through verified programs',
    ],
    avgKg: 600,
    tip: 'Train travel emits 5-7× less CO₂ than flying the same distance.',
  },
  water: {
    whyItMatters:
      'Heating water for showers, laundry, and dishes uses significant energy. Water treatment plants also consume electricity.',
    potentialReductions: [
      'Shorten showers by 2 minutes',
      'Wash clothes in cold water',
      'Install low-flow fixtures',
    ],
    avgKg: 300,
    tip: 'Washing clothes in cold water instead of hot can save 225 kg of CO₂ per year.',
  },
};

// ---- Priority Badge ----

function getPriority(percentage: number): {
  label: string;
  color: string;
  bgColor: string;
} {
  if (percentage >= 25) return { label: 'High', color: '#C1121F', bgColor: 'rgba(230,57,70,0.12)' };
  if (percentage >= 12) return { label: 'Medium', color: '#E07A00', bgColor: 'rgba(249,168,38,0.12)' };
  return { label: 'Low', color: '#0096C7', bgColor: 'rgba(72,202,228,0.12)' };
}

// ---- Expandable Category Card ----

const CategoryCard: React.FC<{
  item: CategoryBreakdown;
  index: number;
}> = React.memo(({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const details = CATEGORY_DETAILS[item.category];
  const priority = getPriority(item.percentage);

  const handleToggle = useCallback(() => setExpanded((prev) => !prev), []);

  const comparisonChartData = [
    { name: 'You', value: item.kgCO2e, fill: item.color },
    { name: 'Average', value: details.avgKg, fill: alpha(item.color, 0.35) },
  ];

  return (
    <motion.div variants={staggerItem}>
      <Card
        id={`category-card-${item.category}`}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 4,
          background: isDark
            ? `linear-gradient(145deg, ${alpha('#1A2940', 0.85)}, ${alpha('#121E32', 0.65)})`
            : `linear-gradient(145deg, rgba(255,255,255,0.92), rgba(245,250,247,0.65))`,
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: `1px solid ${isDark ? alpha('#52B788', 0.12) : alpha('#2D6A4F', 0.08)}`,
          borderLeft: `4px solid ${item.color}`,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          perspective: '1000px',
          transformStyle: 'preserve-3d',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-4px) translateZ(8px)',
            boxShadow: isDark
              ? `0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px ${alpha(item.color, 0.2)}`
              : `0 16px 48px ${alpha(item.color, 0.15)}, 0 4px 16px ${alpha(item.color, 0.1)}`,
          },
        }}
        onClick={handleToggle}
        role="button"
        aria-expanded={expanded}
        aria-label={`${item.label} category details`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        <CardContent sx={{ py: 2.5, px: 2.5 }}>
          {/* Header row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Icon */}
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: alpha(item.color, 0.12),
                fontSize: '1.5rem',
                flexShrink: 0,
                boxShadow: `0 4px 12px ${alpha(item.color, 0.2)}`,
              }}
            >
              {item.icon}
            </Box>

            {/* Name + stats */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  {item.label}
                </Typography>
                <Chip
                  label={priority.label}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.6rem',
                    height: 20,
                    color: priority.color,
                    background: priority.bgColor,
                  }}
                />
              </Box>

              {/* Bar visualization */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={item.percentage}
                  sx={{
                    flex: 1,
                    height: 8,
                    borderRadius: 1.5,
                    backgroundColor: alpha(item.color, 0.1),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 1.5,
                      background: `linear-gradient(90deg, ${item.color}, ${alpha(item.color, 0.65)})`,
                    },
                  }}
                />
                <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem', minWidth: 35, textAlign: 'right' }}>
                  {item.percentage}%
                </Typography>
              </Box>
            </Box>

            {/* kg value + expand */}
            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem', color: item.color }}>
                {item.kgCO2e.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                kg CO₂e
              </Typography>
            </Box>

            <IconButton
              size="small"
              aria-label={expanded ? 'Collapse details' : 'Expand details'}
              sx={{
                transition: 'transform 0.3s ease',
                transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
                ml: 0.5,
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleToggle();
              }}
            >
              <ExpandIcon />
            </IconButton>
          </Box>

          {/* Expandable details */}
          <Collapse in={expanded} timeout={400}>
            <Box
              sx={{
                mt: 2.5,
                pt: 2.5,
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              }}
            >
              {/* Why It Matters */}
              <Box sx={{ mb: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                  <InfoIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Why It Matters
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, fontSize: '0.82rem' }}>
                  {details.whyItMatters}
                </Typography>
              </Box>

              {/* Comparison Bar Chart */}
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem', mb: 1 }}>
                  Your Value vs. Average
                </Typography>
                <Box sx={{ width: '100%', height: 120 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonChartData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.08)} horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}kg`} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} width={60} />
                      <RechartsTooltip
                        contentStyle={{
                          background: 'rgba(255,255,255,0.95)',
                          backdropFilter: 'blur(12px)',
                          borderRadius: 12,
                          border: '1px solid rgba(0,0,0,0.06)',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                        }}
                        formatter={(value: unknown) => [`${Number(value).toLocaleString()} kg CO₂e`, '']}
                      />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24} animationDuration={1200}>
                        {comparisonChartData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>

                {item.kgCO2e < details.avgKg && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      mt: 1,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      background: alpha('#52B788', 0.1),
                      width: 'fit-content',
                    }}
                  >
                    <CheckIcon sx={{ fontSize: 16, color: '#2D6A4F' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#2D6A4F', fontSize: '0.78rem' }}>
                      Below average — great job!
                    </Typography>
                  </Box>
                )}
                {item.kgCO2e > details.avgKg && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      mt: 1,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      background: alpha('#FF6B6B', 0.1),
                      width: 'fit-content',
                    }}
                  >
                    <WarningIcon sx={{ fontSize: 16, color: '#E63946' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#E63946', fontSize: '0.78rem' }}>
                      Above average — room for improvement
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Potential Reductions */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                  <SavingsIcon sx={{ fontSize: 16, color: '#F9A826' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Potential Reductions
                  </Typography>
                </Box>
                {details.potentialReductions.map((reduction, rIdx) => (
                  <Box key={rIdx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.8 }}>
                    <TrendingDownIcon sx={{ fontSize: 16, color: '#52B788', mt: 0.2 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                      {reduction}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Educational Tooltip */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: isDark ? alpha('#48CAE4', 0.08) : alpha('#48CAE4', 0.06),
                  border: `1px solid ${alpha('#48CAE4', 0.15)}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Typography sx={{ fontSize: '1rem' }}>💡</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.82rem', lineHeight: 1.6, fontStyle: 'italic' }}>
                    {details.tip}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </motion.div>
  );
});
CategoryCard.displayName = 'CategoryCard';

// ---- Main Page ----

const ImpactBreakdownPage: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const report = useCarbonStore((s) => s.currentReport);

  if (!report) {
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <Box sx={{ textAlign: 'center', py: 10, px: 3 }}>
          <Typography sx={{ fontSize: '3.5rem', mb: 2 }}>📊</Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            No Data Yet
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Complete your assessment first to see your impact breakdown.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/assessment')}>
            Start Assessment
          </Button>
        </Box>
      </motion.div>
    );
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <Box sx={{ pb: 10, px: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, mt: 1 }}>
          <IconButton
            id="btn-back-breakdown"
            onClick={() => navigate('/dashboard')}
            aria-label="Back to dashboard"
            sx={{
              background: alpha(theme.palette.primary.main, 0.08),
              '&:hover': { background: alpha(theme.palette.primary.main, 0.15) },
            }}
          >
            <BackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              Impact Breakdown
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem' }}>
              Tap each category for detailed insights
            </Typography>
          </Box>
        </Box>

        {/* Summary chip row */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          <Chip
            label={`${report.totalTonnesCO2e} tCO₂e total`}
            sx={{
              fontWeight: 700,
              background: `linear-gradient(135deg, #2D6A4F, #40916C)`,
              color: '#fff',
              fontSize: '0.82rem',
            }}
          />
          <Chip
            label={`${report.breakdown.length} categories`}
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: '0.82rem' }}
          />
        </Box>

        {/* Methodology Disclaimer */}
        <Box
          sx={{
            mb: 2.5,
            p: 2,
            borderRadius: 3,
            background: isDark
              ? alpha('#48CAE4', 0.06)
              : alpha('#48CAE4', 0.04),
            border: `1px solid ${alpha('#48CAE4', 0.12)}`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
          }}
          role="note"
          aria-label="Methodology disclaimer"
        >
          <InfoIcon sx={{ fontSize: 18, color: alpha(theme.palette.text.secondary, 0.7), mt: 0.2, flexShrink: 0 }} />
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>
            All figures are estimates based on EPA, IPCC AR6 &amp; DEFRA 2023 emission factors.
            Actual emissions vary by region, habits, and data accuracy. Use these as directional guidance, not precise measurements.
          </Typography>
        </Box>

        {/* Category Cards */}
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          <Grid container spacing={2}>
            {report.breakdown.map((item, idx) => (
              <Grid size={{ xs: 12 }} key={item.category}>
                <CategoryCard item={item} index={idx} />
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default ImpactBreakdownPage;
