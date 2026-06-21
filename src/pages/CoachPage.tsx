// ============================================================
// EcoPulse AI — AI Eco Coach Page
// Gemini-powered sustainability coach with chat interface
// ============================================================

// Security: Chat messages are rendered using escapeHtml + React
// to prevent XSS via dangerouslySetInnerHTML.

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';

import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { alpha, useTheme } from '@mui/material/styles';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import TipsAndUpdatesRoundedIcon from '@mui/icons-material/TipsAndUpdatesRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { useChatStore, useCarbonStore, useGoalStore } from '../stores/appStore';
import { sendMessage, getSuggestedPrompts, isGeminiConfigured, getApiKey } from '../services/geminiService';
import { pageVariants } from '../theme/animations';

/**
 * Parse markdown-like bold syntax and newlines into React elements.
 *
 * Unlike the previous implementation that used `dangerouslySetInnerHTML`,
 * this version avoids XSS by never inserting raw HTML. Bold markers are
 * converted to `<strong>` elements and newlines to `<br/>` elements
 * via React.createElement, while all other text is rendered as plain
 * text nodes (automatically escaped by React).
 *
 * @param text - Raw message text (may contain `**bold**` and `\n`)
 * @returns Array of React nodes safe for rendering
 */
function formatMessage(text: string): React.ReactNode[] {
  // Split on bold markers and newlines
  const parts = text.split(/(\*\*.*?\*\*|\n)/g);
  return parts.map((part, i) => {
    if (part === '\n') {
      return React.createElement('br', { key: `br-${i}` });
    }
    const boldMatch = part.match(/^\*\*(.+)\*\*$/);
    if (boldMatch) {
      return React.createElement('strong', { key: `b-${i}` }, boldMatch[1]);
    }
    return part; // plain text — React auto-escapes
  });
}

export default function CoachPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Stores
  const { messages, isLoading, addMessage, setLoading, clearHistory } = useChatStore();
  const currentReport = useCarbonStore((s) => s.currentReport);
  const recommendations = useCarbonStore((s) => s.recommendations);
  const goals = useGoalStore((s) => s.goals);


  // Local state
  const [input, setInput] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showApiDialog, setShowApiDialog] = useState(false);
  const [localApiKey, setLocalApiKey] = useState<string | null>(
    () => sessionStorage.getItem('ecopulse_gemini_key')
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const hasApiKey = isGeminiConfigured() || Boolean(localApiKey);
  const suggestedPrompts = getSuggestedPrompts(currentReport);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Send welcome message on first visit
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        role: 'assistant',
        content: `Welcome to your AI Eco Coach! 🌿\n\nI'm here to help you understand and reduce your carbon footprint. ${
          currentReport
            ? `I can see your footprint is **${currentReport.totalTonnesCO2e} tonnes CO₂e/year**. Let's work together to bring that down!`
            : "Start by completing your carbon assessment, then I can give you personalized advice!"
        }\n\nAsk me anything about sustainability, your impact, or how to make greener choices. 💚`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Handle sending a message */
  const handleSend = useCallback(async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || isLoading) return;

    // Add user message
    addMessage({ role: 'user', content: text });
    setInput('');
    setLoading(true);

    try {
      const apiKey = localApiKey || getApiKey();
      const response = await sendMessage(text, currentReport, goals, recommendations, apiKey ?? undefined);
      addMessage({ role: 'assistant', content: response });
    } catch {
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again! 🔄',
      });
    } finally {
      setLoading(false);
    }
  }, [input, isLoading, addMessage, setLoading, currentReport, goals, recommendations, localApiKey]);

  /** Handle suggested prompt click */
  const handlePromptClick = useCallback(
    (prompt: string) => {
      handleSend(prompt);
    },
    [handleSend]
  );

  /** Save API key to session */
  const handleSaveApiKey = useCallback(() => {
    if (apiKeyInput.trim()) {
      sessionStorage.setItem('ecopulse_gemini_key', apiKeyInput.trim());
      setLocalApiKey(apiKeyInput.trim());
    }
    setShowApiDialog(false);
    setApiKeyInput('');
  }, [apiKeyInput]);

  /** Handle keyboard submit */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <Container maxWidth="md" sx={{ py: 3, height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              <SmartToyRoundedIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                AI Eco Coach
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AutoAwesomeRoundedIcon sx={{ fontSize: 14 }} />
                {hasApiKey ? 'Powered by Google Gemini' : 'Smart Responses (Add API key for AI)'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Configure Gemini API Key" arrow>
              <IconButton
                onClick={() => setShowApiDialog(true)}
                size="small"
                aria-label="Configure API key"
                sx={{
                  bgcolor: hasApiKey
                    ? alpha(theme.palette.success.main, 0.1)
                    : alpha(theme.palette.warning.main, 0.1),
                  color: hasApiKey ? 'success.main' : 'warning.main',
                }}
              >
                <KeyRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear chat history" arrow>
              <IconButton
                onClick={clearHistory}
                size="small"
                aria-label="Clear chat history"
                sx={{ bgcolor: alpha(theme.palette.error.main, 0.08), color: 'error.main' }}
              >
                <DeleteSweepRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* API Info Banner */}
        {!hasApiKey && (
          <Alert
            severity="info"
            icon={<TipsAndUpdatesRoundedIcon />}
            sx={{ mb: 2, borderRadius: 3 }}
            action={
              <Button
                color="info"
                size="small"
                onClick={() => setShowApiDialog(true)}
                sx={{ textTransform: 'none' }}
              >
                Add Key
              </Button>
            }
          >
            Using smart fallback responses. Add a free Gemini API key for personalized AI coaching!
          </Alert>
        )}

        {/* Chat Messages Area */}
        <Card
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: isDark
              ? alpha(theme.palette.background.paper, 0.5)
              : alpha('#FFFFFF', 0.8),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
          }}
        >
          {/* Messages scroll area */}
          <Box
            ref={scrollRef}
            sx={{
              flex: 1,
              overflow: 'auto',
              px: { xs: 2, sm: 3 },
              py: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
            role="log"
            aria-label="Chat messages"
            aria-live="polite"
          >
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                >
                  <Box
                    aria-label={msg.role === 'user' ? 'Message from user' : 'Message from AI assistant'}
                    sx={{
                      display: 'flex',
                      gap: 1.5,
                      flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                      alignItems: 'flex-start',
                    }}
                  >
                    {/* Avatar */}
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        flexShrink: 0,
                        background:
                          msg.role === 'assistant'
                            ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                            : `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.error.light})`,
                        fontSize: 18,
                      }}
                    >
                      {msg.role === 'assistant' ? (
                        <SmartToyRoundedIcon sx={{ fontSize: 20 }} />
                      ) : (
                        <PersonRoundedIcon sx={{ fontSize: 20 }} />
                      )}
                    </Avatar>

                    {/* Message bubble */}
                    <Box
                      sx={{
                        maxWidth: '80%',
                        px: 2.5,
                        py: 1.5,
                        borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                        background:
                          msg.role === 'user'
                            ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                            : isDark
                              ? alpha(theme.palette.background.paper, 0.6)
                              : alpha(theme.palette.primary.main, 0.06),
                        color:
                          msg.role === 'user'
                            ? '#FFFFFF'
                            : theme.palette.text.primary,
                        border:
                          msg.role === 'assistant'
                            ? `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                            : 'none',
                        boxShadow:
                          msg.role === 'user'
                            ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`
                            : '0 2px 8px rgba(0,0,0,0.06)',
                      }}
                    >
                      <Typography
                        variant="body2"
                        component="div"
                        sx={{
                          lineHeight: 1.65,
                          '& strong': { fontWeight: 600 },
                        }}
                      >
                        {formatMessage(msg.content)}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 0.5,
                          opacity: 0.6,
                          textAlign: msg.role === 'user' ? 'right' : 'left',
                          fontSize: '0.7rem',
                        }}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    }}
                  >
                    <SmartToyRoundedIcon sx={{ fontSize: 20 }} />
                  </Avatar>
                  <Box
                    sx={{
                      px: 2.5,
                      py: 1.5,
                      borderRadius: '20px 20px 20px 4px',
                      background: isDark
                        ? alpha(theme.palette.background.paper, 0.6)
                        : alpha(theme.palette.primary.main, 0.06),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      display: 'flex',
                      gap: 0.5,
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: theme.palette.primary.main,
                          animation: `bounce 1.4s infinite ease-in-out both`,
                          animationDelay: `${i * 0.16}s`,
                          '@keyframes bounce': {
                            '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: 0.4 },
                            '40%': { transform: 'scale(1)', opacity: 1 },
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </motion.div>
            )}
          </Box>

          <Divider sx={{ opacity: 0.5 }} />

          {/* Suggested Prompts */}
          <Box
            sx={{
              px: { xs: 2, sm: 3 },
              py: 1.5,
              display: 'flex',
              gap: 1,
              overflowX: 'auto',
              '&::-webkit-scrollbar': { height: 0 },
            }}
          >
            {suggestedPrompts.slice(0, 4).map((prompt) => (
              <Chip
                key={prompt}
                label={prompt}
                size="small"
                variant="outlined"
                onClick={() => handlePromptClick(prompt)}
                aria-label={`Suggested question: ${prompt}`}
                sx={{
                  flexShrink: 0,
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    borderColor: theme.palette.primary.main,
                  },
                }}
              />
            ))}
          </Box>

          {/* Input area */}
          <Box
            sx={{
              px: { xs: 2, sm: 3 },
              py: 2,
              display: 'flex',
              gap: 1,
              alignItems: 'flex-end',
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Ask about your carbon footprint..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              aria-label="Type your message"
              slotProps={{
                input: {
                  sx: {
                    borderRadius: 3,
                    bgcolor: isDark
                      ? alpha(theme.palette.background.default, 0.5)
                      : alpha(theme.palette.background.default, 0.8),
                  },
                },
              }}
              size="small"
            />
            <IconButton
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              sx={{
                width: 44,
                height: 44,
                flexShrink: 0,
                background: input.trim()
                  ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                  : undefined,
                color: input.trim() ? '#FFFFFF' : undefined,
                boxShadow: input.trim() ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}` : undefined,
                '&:hover': {
                  background: input.trim()
                    ? `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
                    : undefined,
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={20} sx={{ color: 'inherit' }} />
              ) : (
                <SendRoundedIcon />
              )}
            </IconButton>
          </Box>
        </Card>

        {/* API Key Dialog */}
        <Dialog
          open={showApiDialog}
          onClose={() => setShowApiDialog(false)}
          maxWidth="sm"
          fullWidth
          slotProps={{ paper: { sx: { borderRadius: 4 } } }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>
            🔑 Configure Gemini API Key
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Get a free API key from{' '}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: theme.palette.primary.main }}
              >
                Google AI Studio
              </a>{' '}
              to enable personalized AI coaching powered by Gemini.
            </Typography>
            <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
              Your key is stored only in this browser session and never sent to our servers.
            </Alert>
            <TextField
              fullWidth
              label="Gemini API Key"
              placeholder="AIza..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              type="password"
              aria-label="Enter your Gemini API key"
              slotProps={{
                input: {
                  sx: { borderRadius: 2 },
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setShowApiDialog(false)} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={handleSaveApiKey}
              variant="contained"
              disabled={!apiKeyInput.trim()}
            >
              Save Key
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </motion.div>
  );
}
