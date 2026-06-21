/**
 * @fileoverview EcoPulse AI — Landing Page.
 * Premium 3D hero with glassmorphism and nature aesthetics.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { alpha, useTheme } from '@mui/material/styles';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useUserStore, useAssessmentStore } from '../stores/appStore';
import { staggerContainer, staggerItem, fadeInUp } from '../theme/animations';

// Feature cards data
const FEATURES = [
  {
    icon: '📊',
    title: 'Smart Assessment',
    description: 'AI-powered carbon footprint calculator that analyzes your lifestyle across 7 categories.',
  },
  {
    icon: '🤖',
    title: 'AI Eco Coach',
    description: 'Personalized advice from Gemini AI that adapts to your habits and goals.',
  },
  {
    icon: '🎯',
    title: 'Goal Tracking',
    description: 'Set achievable sustainability goals and build lasting eco-friendly habits.',
  },
  {
    icon: '📈',
    title: 'Impact Insights',
    description: 'Visualize your progress with beautiful charts and real-time impact metrics.',
  },
  {
    icon: '🏆',
    title: 'Challenges & Badges',
    description: 'Join weekly challenges and earn achievements as you reduce your footprint.',
  },
  {
    icon: '🌍',
    title: 'Community',
    description: 'See how you compare and get inspired by top eco-champions globally.',
  },
];

const STATS = [
  { value: '7', label: 'Impact Categories' },
  { value: '21+', label: 'Eco Actions' },
  { value: '12', label: 'Achievements' },
  { value: '6', label: 'Challenges' },
];

/** Landing page with hero section, feature showcase, CTA, and footer. */
export default function LandingPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isAuth = useUserStore((s) => s.isAuthenticated);
  const assessmentCompleted = useAssessmentStore((s) => s.isCompleted);
  const login = useUserStore((s) => s.login);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  const handleGetStarted = () => {
    if (!isAuth) {
      login('Eco Explorer');
    }
    if (assessmentCompleted) {
      navigate('/dashboard');
    } else {
      navigate('/assessment');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `
            radial-gradient(ellipse 80% 60% at 50% 0%, ${alpha('#52B788', 0.15)} 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 50%, ${alpha('#48CAE4', 0.1)} 0%, transparent 50%),
            radial-gradient(ellipse 50% 50% at 20% 80%, ${alpha('#2D6A4F', 0.08)} 0%, transparent 50%),
            ${theme.palette.background.default}
          `,
          px: 2,
          pb: 8,
        }}
      >
        {/* Floating orbs (decorative 3D elements) */}
        {[
          { size: 300, x: '10%', y: '20%', color: '#52B788', delay: 0 },
          { size: 200, x: '80%', y: '30%', color: '#48CAE4', delay: 1 },
          { size: 150, x: '70%', y: '70%', color: '#2D6A4F', delay: 2 },
          { size: 100, x: '15%', y: '75%', color: '#74C69D', delay: 0.5 },
        ].map((orb, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: orb.delay,
            }}
            style={{
              position: 'absolute',
              left: orb.x,
              top: orb.y,
              width: orb.size,
              height: orb.size,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha(orb.color, 0.12)} 0%, transparent 70%)`,
              filter: 'blur(40px)',
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Navigation */}
        <Box
          component="nav"
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            py: 2,
            px: { xs: 2, md: 6 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: alpha(theme.palette.background.default, 0.7),
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.06)}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ fontSize: 28 }}>🌿</Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #1B4332, #52B788)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              EcoPulse AI
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="small"
            onClick={handleGetStarted}
            id="nav-get-started"
            sx={{ borderRadius: 3, px: 3 }}
          >
            Get Started
          </Button>
        </Box>

        {/* Hero Content */}
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 10, pt: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2.5,
                  py: 0.8,
                  borderRadius: 100,
                  background: alpha(theme.palette.primary.main, 0.08),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                  mb: 4,
                }}
              >
                <Box sx={{ fontSize: 14 }}>✨</Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.primary.main, letterSpacing: '0.05em' }}>
                  AI-POWERED SUSTAINABILITY
                </Typography>
              </Box>
            </motion.div>

            {/* Headline */}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.2rem' },
                fontWeight: 900,
                lineHeight: 1.05,
                mb: 3,
                color: theme.palette.text.primary,
                letterSpacing: '-0.03em',
              }}
            >
              Turn everyday choices into{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #2D6A4F 0%, #52B788 50%, #48CAE4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                meaningful climate action
              </Box>
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 400,
                maxWidth: 600,
                mx: 'auto',
                mb: 5,
                lineHeight: 1.6,
                fontSize: { xs: '1rem', md: '1.15rem' },
              }}
            >
              Understand your carbon footprint, get personalized AI-powered insights,
              and build sustainable habits that actually stick.
            </Typography>

            {/* CTA Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 6 }}>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGetStarted}
                  id="hero-get-started"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    py: 1.8,
                    px: 5,
                    fontSize: '1.05rem',
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #40916C 100%)',
                    boxShadow: '0 8px 32px rgba(27, 67, 50, 0.3)',
                    '&:hover': {
                      boxShadow: '0 12px 40px rgba(27, 67, 50, 0.4)',
                    },
                  }}
                >
                  Calculate Your Footprint
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    if (!isAuth) login('Eco Explorer');
                    navigate('/dashboard');
                  }}
                  id="hero-explore"
                  sx={{
                    py: 1.8,
                    px: 4,
                    fontSize: '1.05rem',
                    borderRadius: 4,
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    color: theme.palette.primary.main,
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      background: alpha(theme.palette.primary.main, 0.04),
                    },
                  }}
                >
                  Explore Demo
                </Button>
              </motion.div>
            </Box>

            {/* Stats */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: { xs: 3, md: 6 },
                  flexWrap: 'wrap',
                }}
              >
                {STATS.map((stat) => (
                  <motion.div key={stat.label} variants={staggerItem}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 800,
                          color: theme.palette.primary.main,
                          fontSize: { xs: '1.8rem', md: '2.2rem' },
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </motion.div>
        </Container>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ position: 'absolute', bottom: 40 }}
        >
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
            Scroll to explore ↓
          </Typography>
        </motion.div>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          px: 2,
          background: theme.palette.background.paper,
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              sx={{
                textAlign: 'center',
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: '1.8rem', md: '2.5rem' },
              }}
            >
              Everything you need to{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #2D6A4F, #48CAE4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                go green
              </Box>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                color: theme.palette.text.secondary,
                maxWidth: 600,
                mx: 'auto',
                mb: 8,
              }}
            >
              Powered by Google Gemini AI and evidence-based sustainability science
            </Typography>
          </motion.div>

          <Grid container spacing={3}>
            {FEATURES.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={feature.title}>
                <motion.div
                  initial={{ opacity: 0, y: 30, rotateX: -5 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card
                    sx={{
                      p: 3.5,
                      height: '100%',
                      cursor: 'default',
                      perspective: 1000,
                      transformStyle: 'preserve-3d',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-8px) rotateX(2deg) rotateY(-2deg)',
                        boxShadow: `0 20px 50px ${alpha(theme.palette.primary.main, 0.12)}`,
                      },
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
                        fontSize: 28,
                        mb: 2.5,
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.secondary.main, 0.08)})`,
                        boxShadow: `inset 0 1px 0 ${alpha('#fff', 0.5)}`,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.7 }}>
                      {feature.description}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          px: 2,
          background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 40%, #40916C 100%)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: alpha('#52B788', 0.1),
            top: -200,
            right: -100,
            filter: 'blur(60px)',
          }}
        />

        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              sx={{
                color: '#fff',
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: '1.8rem', md: '2.5rem' },
              }}
            >
              Ready to make a difference?
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: alpha('#fff', 0.8), mb: 5, lineHeight: 1.7 }}
            >
              It takes just 5 minutes to understand your carbon footprint.
              Small actions, repeated consistently, create meaningful change.
            </Typography>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleGetStarted}
                id="cta-get-started"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  py: 1.8,
                  px: 5,
                  fontSize: '1.05rem',
                  borderRadius: 4,
                  background: '#fff',
                  color: '#1B4332',
                  fontWeight: 700,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                  '&:hover': {
                    background: '#f0faf4',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
                  },
                }}
              >
                Start Your Journey
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 4,
          px: 3,
          borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          background: theme.palette.background.default,
        }}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
            EcoPulse AI
          </Typography>
          <Typography variant="caption" color="text.secondary">
            © 2026 EcoPulse AI. Empowering personal climate action through AI.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {['Mission', 'Privacy', 'Support', 'About'].map((link) => (
            <Typography
              key={link}
              variant="body2"
              onClick={() => setSnackbar({ open: true, message: 'Coming soon! 🚀' })}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSnackbar({ open: true, message: 'Coming soon! 🚀' }); } }}
              role="button"
              tabIndex={0}
              sx={{
                color: theme.palette.text.secondary,
                cursor: 'pointer',
                '&:hover': { color: theme.palette.primary.main },
              }}
            >
              {link}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* Snackbar for footer link feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ open: false, message: '' })}
          severity="info"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
