/**
 * @fileoverview EcoPulse AI — Carbon Footprint Assessment Page.
 * Slim orchestrator that composes step components, stepper UI,
 * and celebration summary into a multi-step assessment flow.
 */

import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery,
  alpha,
  LinearProgress,
} from '@mui/material';
import { ArrowBack, ArrowForward, Check } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssessmentStore } from '../stores/appStore';
import { fadeInUp, tapScale } from '../theme/animations';
import { palette } from '../theme/theme';
import {
  STEP_META,
  STEP_LABELS,
  TOTAL_FORM_STEPS,
  GradientConnector,
  stepVariants,
} from './assessment/constants';
import CustomStepIcon from './assessment/CustomStepIcon';
import {
  TransportationStep,
  DietStep,
  ElectricityStep,
  ShoppingStep,
  WasteStep,
  WaterStep,
  TravelStep,
  LifestyleStep,
} from './assessment/StepComponents';
import CelebrationSummary from './assessment/CelebrationSummary';

/** Multi-step carbon footprint assessment page with stepper, form inputs, and celebration summary. */
export default function AssessmentPage(): React.JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const currentStep = useAssessmentStore((s) => s.currentStep);
  const setStep = useAssessmentStore((s) => s.setStep);
  const completeAssessment = useAssessmentStore((s) => s.completeAssessment);

  // Track animation direction for slide
  const [direction, setDirection] = useState(0);

  const isOnSummary = currentStep >= TOTAL_FORM_STEPS;
  const progress = ((currentStep) / TOTAL_FORM_STEPS) * 100;

  // Navigation handlers
  const handleNext = useCallback(() => {
    setDirection(1);
    setStep(currentStep + 1);
  }, [currentStep, setStep]);

  const handleBack = useCallback(() => {
    setDirection(-1);
    setStep(currentStep - 1);
  }, [currentStep, setStep]);

  const handleComplete = useCallback(() => {
    completeAssessment();
    navigate('/dashboard');
  }, [completeAssessment, navigate]);

  // Render the current step's content
  const stepContent = useMemo(() => {
    switch (currentStep) {
      case 0: return <TransportationStep />;
      case 1: return <DietStep />;
      case 2: return <ElectricityStep />;
      case 3: return <ShoppingStep />;
      case 4: return <WasteStep />;
      case 5: return <WaterStep />;
      case 6: return <TravelStep />;
      case 7: return <LifestyleStep />;
      default: return <CelebrationSummary onComplete={handleComplete} />;
    }
  }, [currentStep, handleComplete]);

  const currentMeta = STEP_META[Math.min(currentStep, TOTAL_FORM_STEPS - 1)];

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: theme.palette.mode === 'dark'
          ? `radial-gradient(ellipse at 20% 0%, ${alpha(palette.emerald, 0.08)} 0%, transparent 50%),
             radial-gradient(ellipse at 80% 100%, ${alpha(palette.skyBlue, 0.06)} 0%, transparent 50%),
             ${theme.palette.background.default}`
          : `radial-gradient(ellipse at 20% 0%, ${alpha(palette.mintGreen, 0.15)} 0%, transparent 50%),
             radial-gradient(ellipse at 80% 100%, ${alpha(palette.skyBlue, 0.1)} 0%, transparent 50%),
             ${theme.palette.background.default}`,
        pb: 6,
        pt: { xs: 2, md: 4 },
        px: 2,
      }}
    >
      {/* Progress bar */}
      <Box sx={{ width: '100%', maxWidth: 720, mb: { xs: 2, md: 3 } }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          aria-label={`Assessment progress: step ${Math.min(currentStep + 1, TOTAL_FORM_STEPS)} of ${TOTAL_FORM_STEPS}`}
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: alpha(theme.palette.text.secondary, 0.1),
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
              background: `linear-gradient(90deg, ${palette.emerald}, ${palette.mintGreen}, ${palette.skyBlue})`,
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            },
          }}
        />
        <Typography
          variant="caption"
          sx={{ display: 'block', textAlign: 'right', mt: 0.5, color: theme.palette.text.secondary, fontWeight: 500 }}
        >
          {Math.min(currentStep + 1, TOTAL_FORM_STEPS)} of {TOTAL_FORM_STEPS}
        </Typography>
      </Box>

      {/* Stepper — shows step labels on tablet+ */}
      {!isMobile && (
        <Stepper
          activeStep={currentStep}
          alternativeLabel
          connector={<GradientConnector />}
          aria-label="Assessment progress"
          sx={{
            width: '100%',
            maxWidth: 820,
            mb: 4,
            '& .MuiStepLabel-label': {
              fontSize: isTablet ? '0.7rem' : '0.78rem',
              fontWeight: 500,
              mt: 1,
            },
            '& .MuiStepLabel-label.Mui-active': {
              fontWeight: 700,
              color: palette.emerald,
            },
            '& .MuiStepLabel-label.Mui-completed': {
              color: palette.emerald,
            },
          }}
        >
          {STEP_LABELS.map((label, idx) => (
            <Step key={label} completed={idx < currentStep}>
              <StepLabel
                slots={{
                  stepIcon: (props: { active?: boolean; completed?: boolean; icon: React.ReactNode }) => (
                    <CustomStepIcon {...props} icon={idx + 1} />
                  ),
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      )}

      {/* Main glassmorphism card container */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        style={{ width: '100%', maxWidth: 620, perspective: 1200 }}
      >
        <Box
          sx={{
            borderRadius: { xs: 4, md: 5 },
            p: { xs: 3, sm: 4, md: 5 },
            background: theme.palette.mode === 'dark'
              ? `linear-gradient(145deg, ${alpha('#1A2940', 0.85)}, ${alpha('#121E32', 0.7)})`
              : 'linear-gradient(145deg, rgba(255,255,255,0.85), rgba(250,253,246,0.7))',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: theme.palette.mode === 'dark'
              ? `1px solid ${alpha(palette.mintGreen, 0.12)}`
              : '1px solid rgba(255,255,255,0.5)',
            boxShadow: theme.palette.mode === 'dark'
              ? `0 20px 60px rgba(0,0,0,0.4), 0 1px 0 ${alpha(palette.mintGreen, 0.05)} inset`
              : '0 20px 60px rgba(27, 67, 50, 0.08), 0 4px 16px rgba(27, 67, 50, 0.04)',
            transform: 'translateZ(0)',
            transformStyle: 'preserve-3d',
            minHeight: { xs: 400, md: 440 },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Step header with emoji and title */}
          {!isOnSummary && (
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <motion.div
                key={`emoji-${currentStep}`}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '3rem', md: '3.5rem' },
                    lineHeight: 1,
                    mb: 1,
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                  }}
                >
                  {currentMeta.emoji}
                </Typography>
              </motion.div>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${currentMeta.color}, ${palette.emerald})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {currentMeta.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary, mt: 0.5, fontWeight: 400 }}
              >
                {currentMeta.description}
              </Typography>
            </Box>
          )}

          {/* Animated step content */}
          <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {stepContent}
              </motion.div>
            </AnimatePresence>
          </Box>

          {/* Navigation buttons */}
          {!isOnSummary && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 4,
                pt: 2,
                borderTop: `1px solid ${alpha(theme.palette.text.secondary, 0.08)}`,
              }}
            >
              <Button
                id="assessment-back-btn"
                disabled={currentStep === 0}
                onClick={handleBack}
                startIcon={<ArrowBack />}
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 600,
                  visibility: currentStep === 0 ? 'hidden' : 'visible',
                  '&:hover': { color: palette.emerald },
                }}
              >
                Back
              </Button>

              {/* Step dots (mobile) */}
              {isMobile && (
                <Box sx={{ display: 'flex', gap: 0.6 }}>
                  {STEP_META.map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: i === currentStep ? 18 : 6,
                        height: 6,
                        borderRadius: 3,
                        background:
                          i < currentStep
                            ? palette.emerald
                            : i === currentStep
                            ? `linear-gradient(90deg, ${palette.emerald}, ${palette.mintGreen})`
                            : alpha(theme.palette.text.secondary, 0.15),
                        transition: 'all 0.3s',
                      }}
                    />
                  ))}
                </Box>
              )}

              <Button
                id="assessment-next-btn"
                variant="contained"
                onClick={handleNext}
                endIcon={currentStep === TOTAL_FORM_STEPS - 1 ? <Check /> : <ArrowForward />}
                sx={{
                  px: 3.5,
                  py: 1.2,
                  fontWeight: 700,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${palette.emerald}, ${palette.mintGreen})`,
                  boxShadow: `0 4px 16px ${alpha(palette.emerald, 0.3)}`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${palette.forestGreen}, ${palette.emerald})`,
                    boxShadow: `0 6px 24px ${alpha(palette.emerald, 0.4)}`,
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.3s ease',
                }}
                {...tapScale}
              >
                {currentStep === TOTAL_FORM_STEPS - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          )}
        </Box>
      </motion.div>
    </Box>
  );
}
