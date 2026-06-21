/**
 * @fileoverview EcoPulse AI — Dashboard Page.
 * Stunning 3D glassmorphism dashboard with animated charts.
 */

import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  useTheme,
  alpha,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  TrendingDown as TrendingDownIcon,
  Park as ParkIcon,
  EnergySavingsLeafRounded as EcoIcon,
  ArrowForwardRounded as ArrowForwardIcon,
  AutoAwesomeRounded as SparkleIcon,
  LightbulbRounded as LightbulbIcon,
  NaturePeopleRounded as NatureIcon,
  BarChartRounded as BarChartIcon,
  InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { useCarbonStore } from '../stores/appStore';
import { treesEquivalent } from '../engine/carbonCalculator';
import {
  staggerContainer,
  cardVariants,
  fadeInUp,
  pageVariants,
} from '../theme/animations';
import GlassCard from '../components/GlassCard';
import {
  AnimatedCounter,
  WelcomeState,
  PieTooltipContent,
} from './dashboard/DashboardHelpers';
import { getEcoLevel, generateMonthlyTrend } from './dashboard/dashboardUtils';



/** Main dashboard page with carbon footprint overview, charts, benchmarks, and recommendations. */
const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const report = useCarbonStore((s) => s.currentReport);
  const recommendations = useCarbonStore((s) => s.recommendations);


  // Derived data
  const ecoLevel = useMemo(
    () => (report ? getEcoLevel(report.totalTonnesCO2e) : null),
    [report]
  );

  const trees = useMemo(
    () => (report ? treesEquivalent(report.totalKgCO2e) : 0),
    [report]
  );

  const monthlyTrend = useMemo(
    () => (report ? generateMonthlyTrend(report.totalKgCO2e) : []),
    [report]
  );

  const topRecommendations = useMemo(
    () => recommendations.filter((r) => !r.completed).slice(0, 3),
    [recommendations]
  );

  const improvementOpportunities = useMemo(() => {
    if (!report) return [];
    return [...report.breakdown]
      .sort((a, b) => b.kgCO2e - a.kgCO2e)
      .slice(0, 3);
  }, [report]);

  // No report — show welcome state
  if (!report) return <WelcomeState />;

  const comparisonData = [
    { label: 'You', value: report.totalKgCO2e, color: '#52B788' },
    { label: 'Global Avg', value: report.benchmarks.globalAverage, color: '#FF6B6B' },
    { label: 'Eco Target', value: report.benchmarks.ecoTarget, color: '#48CAE4' },
  ];
  const maxBenchmark = Math.max(...comparisonData.map((d) => d.value));

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Box sx={{ pb: 10, px: { xs: 2, sm: 3 } }}>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* ===================== HERO CARD ===================== */}
          <motion.div variants={cardVariants}>
            <Card
              id="hero-carbon-score"
              sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 5,
                mb: 3,
                background: `linear-gradient(135deg, #1B4332 0%, #2D6A4F 40%, #40916C 80%, #52B788 100%)`,
                color: '#fff',
                boxShadow: `0 16px 64px ${alpha('#1B4332', 0.4)}, 0 4px 16px ${alpha('#1B4332', 0.2)}`,
                perspective: '1200px',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Floating orbs decorations */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -40,
                  right: -40,
                  width: 180,
                  height: 180,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -20,
                  left: -20,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(72,202,228,0.15) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />

              <CardContent sx={{ py: { xs: 4, md: 5 }, px: { xs: 3, md: 5 }, position: 'relative', zIndex: 1 }}>
                <Typography
                  variant="overline"
                  sx={{ color: alpha('#fff', 0.8), letterSpacing: 2, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  <EcoIcon sx={{ fontSize: 16 }} /> Your Carbon Footprint
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 1, mb: 0.5 }}>
                  <Typography
                    variant="h2"
                    component="div"
                    sx={{
                      fontWeight: 900,
                      fontSize: { xs: '3rem', sm: '3.8rem', md: '4.2rem' },
                      lineHeight: 1,
                      textShadow: '0 2px 16px rgba(0,0,0,0.2)',
                    }}
                  >
                    <AnimatedCounter value={report.totalTonnesCO2e} decimals={1} />
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 500, color: alpha('#fff', 0.85), fontSize: { xs: '1.1rem', sm: '1.3rem' } }}
                  >
                    tCO₂e/year
                  </Typography>
                </Box>

                <Typography variant="body1" sx={{ color: alpha('#fff', 0.75), maxWidth: 400, mt: 1 }}>
                  {report.totalTonnesCO2e <= report.benchmarks.ecoTarget / 1000
                    ? "Excellent! You're within the eco target. Keep up the great work!"
                    : report.totalTonnesCO2e <= report.benchmarks.globalAverage / 1000
                    ? "Good — you're below the global average. There's still room to improve!"
                    : "Your footprint is above average. Let's find ways to reduce it together!"}
                </Typography>

                {/* Methodology Disclaimer */}
                <Box
                  sx={{
                    mt: 2,
                    p: 1.5,
                    borderRadius: 2,
                    background: alpha('#fff', 0.1),
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                  }}
                  role="note"
                  aria-label="Methodology disclaimer"
                >
                  <InfoIcon sx={{ fontSize: 16, color: alpha('#fff', 0.7), mt: 0.2, flexShrink: 0 }} />
                  <Typography variant="caption" sx={{ color: alpha('#fff', 0.7), lineHeight: 1.5 }}>
                    Estimates based on EPA, IPCC AR6 &amp; DEFRA 2023 emission factors.
                    These are approximations — actual emissions vary by region, habits, and data accuracy.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* ===================== COMPARISON BARS ===================== */}
          <GlassCard id="comparison-bars" sx={{ mb: 3, borderRadius: 4 }}>
            <CardContent sx={{ py: 3, px: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                <BarChartIcon sx={{ color: theme.palette.primary.main, fontSize: 22 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                  How You Compare
                </Typography>
              </Box>

              {comparisonData.map((item) => (
                <Box key={item.label} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                      {item.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: item.color }}>
                      {(item.value / 1000).toFixed(1)}t
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((item.value / maxBenchmark) * 100, 100)}
                    aria-label={`${item.label}: ${(item.value / 1000).toFixed(1)} tonnes CO₂e`}
                    sx={{
                      height: 12,
                      borderRadius: 2,
                      backgroundColor: alpha(item.color, 0.12),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 2,
                        background: `linear-gradient(90deg, ${item.color}, ${alpha(item.color, 0.7)})`,
                        transition: 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      },
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </GlassCard>

          {/* ===================== DONUT CHART + STATS ROW ===================== */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {/* Donut Chart */}
            <Grid size={{ xs: 12, md: 7 }}>
              <GlassCard id="category-donut" sx={{ height: '100%', borderRadius: 4 }}>
                <CardContent sx={{ py: 3, px: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', mb: 2 }}>
                    Category Breakdown
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: { xs: '100%', sm: 220 }, height: 220, flexShrink: 0 }} role="img" aria-label="Pie chart showing carbon footprint breakdown by category">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={report.breakdown}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={95}
                            paddingAngle={3}
                            dataKey="kgCO2e"
                            stroke="none"
                            animationDuration={1200}
                            animationBegin={300}
                          >
                            {report.breakdown.map((entry, idx) => (
                              <Cell
                                key={`cell-${idx}`}
                                fill={entry.color}
                                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
                              />
                            ))}
                          </Pie>
                          <RechartsTooltip content={<PieTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>

                    {/* Legend */}
                    <Box sx={{ flex: 1, width: '100%' }}>
                      {report.breakdown.map((cat) => (
                        <Box
                          key={cat.category}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            py: 0.8,
                            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                background: cat.color,
                                boxShadow: `0 0 6px ${alpha(cat.color, 0.5)}`,
                              }}
                            />
                            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.82rem' }}>
                              {cat.icon} {cat.label}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.82rem' }}>
                            {cat.percentage}%
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </GlassCard>
            </Grid>

            {/* Trees + Level Column */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Grid container spacing={2} sx={{ height: '100%' }}>
                {/* Trees Saved Equivalent */}
                <Grid size={{ xs: 6, md: 12 }}>
                  <GlassCard
                    id="trees-equivalent"
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      background: isDark
                        ? `linear-gradient(135deg, ${alpha('#1A2940', 0.9)}, ${alpha('#1B4332', 0.4)})`
                        : `linear-gradient(135deg, rgba(255,255,255,0.95), rgba(183,228,199,0.3))`,
                    }}
                  >
                    <CardContent sx={{ py: 2.5, px: 2.5, textAlign: 'center' }}>
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <ParkIcon sx={{ fontSize: 40, color: '#40916C', mb: 0.5 }} />
                      </motion.div>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 900,
                          background: 'linear-gradient(135deg, #2D6A4F, #52B788)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        <AnimatedCounter value={trees} decimals={0} />
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                        Trees needed to offset
                      </Typography>
                    </CardContent>
                  </GlassCard>
                </Grid>

                {/* Eco Level */}
                <Grid size={{ xs: 6, md: 12 }}>
                  <GlassCard
                    id="eco-level"
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      background: isDark
                        ? `linear-gradient(135deg, ${alpha('#1A2940', 0.9)}, ${alpha(ecoLevel?.color ?? '#52B788', 0.15)})`
                        : `linear-gradient(135deg, rgba(255,255,255,0.95), ${alpha(ecoLevel?.color ?? '#52B788', 0.15)})`,
                    }}
                  >
                    <CardContent sx={{ py: 2.5, px: 2.5, textAlign: 'center' }}>
                      <Typography sx={{ fontSize: '2.5rem', lineHeight: 1, mb: 0.5 }}>
                        {ecoLevel?.emoji}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 800,
                          color: ecoLevel?.color,
                          fontSize: '1rem',
                        }}
                      >
                        {ecoLevel?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                        Your Eco Level
                      </Typography>
                    </CardContent>
                  </GlassCard>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* ===================== MONTHLY TREND ===================== */}
          <GlassCard id="monthly-trend" sx={{ mb: 3, borderRadius: 4 }}>
            <CardContent sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingDownIcon sx={{ color: theme.palette.primary.main, fontSize: 22 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                  Monthly Trend
                </Typography>
                <Tooltip title="Your estimated monthly CO₂ emissions based on your assessment" arrow>
                  <IconButton size="small" aria-label="Monthly trend info">
                    <InfoIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box sx={{ width: '100%', height: 220 }} role="img" aria-label="Area chart showing monthly CO₂ emission trends">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#52B788" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#52B788" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.08)} />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => `${v}kg`}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: 12,
                        border: '1px solid rgba(0,0,0,0.06)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                      }}
                      formatter={(value: unknown): [string, string] => [`${Number(value)} kg CO₂e`, 'Emissions']}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#52B788"
                      strokeWidth={3}
                      fill="url(#trendGradient)"
                      animationDuration={1500}
                      dot={{ r: 4, fill: '#2D6A4F', stroke: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: '#52B788', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </GlassCard>

          {/* ===================== RECOMMENDED FOR YOU ===================== */}
          {topRecommendations.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, px: 0.5 }}>
                <SparkleIcon sx={{ color: '#F9A826', fontSize: 22 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                  Recommended for You
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {topRecommendations.map((rec, idx) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={rec.id}>
                    <GlassCard
                      id={`rec-card-${idx}`}
                      sx={{
                        height: '100%',
                        borderRadius: 4,
                        borderLeft: `4px solid ${
                          rec.impact === 'high' ? '#2D6A4F' : rec.impact === 'medium' ? '#F9A826' : '#48CAE4'
                        }`,
                      }}
                    >
                      <CardContent sx={{ py: 2.5, px: 2.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                          <Chip
                            label={rec.impact.toUpperCase()}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              fontSize: '0.65rem',
                              height: 22,
                              background:
                                rec.impact === 'high'
                                  ? alpha('#2D6A4F', 0.15)
                                  : rec.impact === 'medium'
                                  ? alpha('#F9A826', 0.15)
                                  : alpha('#48CAE4', 0.15),
                              color:
                                rec.impact === 'high' ? '#2D6A4F' : rec.impact === 'medium' ? '#E07A00' : '#0096C7',
                            }}
                          />
                          <Chip
                            label={rec.difficulty}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 500, fontSize: '0.65rem', height: 22 }}
                          />
                        </Box>

                        <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 0.5, lineHeight: 1.3 }}>
                          {rec.title}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem', lineHeight: 1.5, mb: 1.5 }}>
                          {rec.description}
                        </Typography>

                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            background: alpha('#52B788', 0.1),
                          }}
                        >
                          <TrendingDownIcon sx={{ fontSize: 14, color: '#2D6A4F' }} />
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D6A4F', fontSize: '0.82rem' }}>
                            −{rec.estimatedReductionKg} kg/yr
                          </Typography>
                        </Box>
                      </CardContent>
                    </GlassCard>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* ===================== IMPROVEMENT OPPORTUNITIES ===================== */}
          <GlassCard id="improvement-opportunities" sx={{ mb: 3, borderRadius: 4 }}>
            <CardContent sx={{ py: 3, px: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LightbulbIcon sx={{ color: '#F9A826', fontSize: 22 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                  Top Improvement Opportunities
                </Typography>
              </Box>

              {improvementOpportunities.map((cat, idx) => (
                <Box
                  key={cat.category}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    py: 1.5,
                    borderBottom: idx < improvementOpportunities.length - 1 ? `1px solid ${alpha(theme.palette.divider, 0.08)}` : 'none',
                  }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: alpha(cat.color, 0.12),
                      fontSize: '1.3rem',
                      flexShrink: 0,
                    }}
                  >
                    {cat.icon}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.88rem' }}>
                      {cat.label}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={cat.percentage}
                      aria-label={`${cat.label}: ${cat.percentage}% of total emissions`}
                      sx={{
                        mt: 0.5,
                        height: 6,
                        borderRadius: 1,
                        backgroundColor: alpha(cat.color, 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 1,
                          background: cat.color,
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: cat.color, fontSize: '0.88rem', flexShrink: 0 }}>
                    {cat.kgCO2e.toLocaleString()} kg
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </GlassCard>

          {/* ===================== LOG TODAY'S ACTIONS CTA ===================== */}
          <motion.div variants={fadeInUp}>
            <Card
              id="cta-log-actions"
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                background: `linear-gradient(135deg, #2D6A4F 0%, #40916C 50%, #48CAE4 100%)`,
                color: '#fff',
                boxShadow: `0 12px 48px ${alpha('#2D6A4F', 0.3)}`,
                transition: 'all 0.35s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 20px 64px ${alpha('#2D6A4F', 0.4)}`,
                },
              }}
            >
              <CardContent
                sx={{
                  py: 3.5,
                  px: 3,
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <NatureIcon sx={{ fontSize: 42, color: alpha('#fff', 0.9) }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', mb: 0.3 }}>
                    Log Today's Eco Actions
                  </Typography>
                  <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
                    Track your daily habits and watch your footprint shrink over time.
                  </Typography>
                </Box>
                <Button
                  id="btn-log-actions"
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  href="/goals"
                  sx={{
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: '#fff',
                    fontWeight: 700,
                    px: 3,
                    flexShrink: 0,
                    '&:hover': {
                      background: 'rgba(255,255,255,0.3)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  Log Actions
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default DashboardPage;
