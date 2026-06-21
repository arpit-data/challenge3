// ============================================================
// EcoPulse AI — Gemini AI Service
// Google Gemini 2.5 Flash integration for Eco Coach,
// AI-powered recommendations, and weekly insights.
// ============================================================

import type { GoogleGenAI as GoogleGenAIType } from '@google/genai';
import type { CarbonReport, Goal, Recommendation } from '../types';
import { sanitizeUserInput, checkRateLimit, validateApiKeyFormat } from '../utils/sanitize';
import { logger } from '../utils/logger';
import {
  RATE_LIMIT_MAX_CALLS,
  RATE_LIMIT_WINDOW_MS,
  REQUEST_TIMEOUT_MS,
  MAX_MESSAGE_LENGTH,
  DEFAULT_REDUCTION_TARGET,
  FALLBACK_REDUCTION_KG,
  GEMINI_MODEL,
  SUMMARY_RATE_LIMIT,
} from '../constants';

const SYSTEM_PROMPT = `You are EcoPulse AI, a positive, empowering sustainability coach. Your role is to help people understand and reduce their carbon footprint through practical, achievable actions.

GUIDELINES:
- Be encouraging, optimistic, and empowering. NEVER shame, guilt, or moralize.
- Provide personalized, evidence-informed recommendations based on the user's specific data.
- Prioritize highest-impact actions that are realistic for the user's lifestyle.
- Always state that carbon estimates are approximations.
- Use simple, clear language accessible to all education levels.
- When giving numbers, round to practical values and explain what they mean in everyday terms.
- Celebrate progress, no matter how small.
- Suggest gradual, incremental changes rather than drastic lifestyle overhauls.
- If asked about topics outside sustainability, politely redirect to environmental topics.
- Format responses with clear structure using bullet points and short paragraphs.
- Keep responses concise (under 200 words unless detailed explanation requested).

NEVER:
- Make moral judgments about lifestyle choices
- Claim scientific certainty for estimates
- Give misleading carbon savings numbers
- Use fear-based or guilt-based messaging
- Make political statements`;

/** Typed reference to the Gemini AI client instance */
let aiInstance: GoogleGenAIType | null = null;

/**
 * Initialize the Gemini AI client with the provided API key.
 *
 * @param apiKey - Google Gemini API key (validated before use)
 * @returns True if initialization succeeded, false otherwise
 */
export async function initializeGemini(apiKey: string): Promise<boolean> {
  if (!validateApiKeyFormat(apiKey)) {
    logger.warn('Gemini AI: Invalid API key format');
    return false;
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    aiInstance = new GoogleGenAI({ apiKey });
    return true;
  } catch (error) {
    logger.warn('Gemini AI initialization failed:', error);
    return false;
  }
}

/**
 * Build a context string from the user's assessment data, goals, and recommendations.
 * This context is prepended to every Gemini prompt for personalization.
 *
 * @param report - The user's latest carbon report (nullable)
 * @param goals - Active goals list
 * @param recommendations - Recommendations list
 * @returns Formatted context string
 */
function buildUserContext(
  report: CarbonReport | null,
  goals: Goal[],
  recommendations: Recommendation[]
): string {
  if (!report) return 'User has not completed their carbon assessment yet.';

  const topCategories = report.breakdown
    .slice(0, 3)
    .map((b) => `${b.label}: ${b.kgCO2e} kg CO₂e/yr (${b.percentage}%)`)
    .join(', ');

  const activeGoals = goals
    .filter((g) => g.status === 'active')
    .map((g) => `${g.title} (streak: ${g.streak} days)`)
    .join(', ');

  const completedRecs = recommendations.filter((r) => r.completed).length;
  const totalSaved = recommendations
    .filter((r) => r.completed)
    .reduce((s, r) => s + r.estimatedReductionKg, 0);

  return `USER CONTEXT:
- Annual Footprint: ${report.totalTonnesCO2e} tonnes CO₂e/year (${report.totalKgCO2e} kg)
- Top Contributors: ${topCategories}
- Global Average: ${report.benchmarks.globalAverage / 1000} tonnes/year
- Active Goals: ${activeGoals || 'None yet'}
- Completed Recommendations: ${completedRecs} (saved ~${totalSaved} kg CO₂)
- Assessment Date: ${new Date(report.createdAt).toLocaleDateString()}`;
}

/**
 * Create a promise that rejects after a timeout period.
 *
 * @param ms - Timeout in milliseconds
 * @returns A promise that rejects with a timeout error
 */
function createTimeout(ms: number): Promise<never> {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out')), ms)
  );
}

/**
 * Call the Gemini model with a prompt, racing against a timeout.
 *
 * @param prompt - The full prompt string to send to Gemini
 * @returns The Gemini response object
 * @throws If the AI client is not initialized or the request times out
 */
async function callGemini(prompt: string): Promise<{ text?: string | null }> {
  if (!aiInstance) throw new Error('Gemini not initialized');
  return Promise.race([
    aiInstance.models.generateContent({ model: GEMINI_MODEL, contents: prompt }),
    createTimeout(REQUEST_TIMEOUT_MS),
  ]);
}

/**
 * Send a message to the Gemini AI coach and get a personalized response.
 * Includes rate limiting, input sanitization, and timeout handling.
 *
 * @param message - User's chat message
 * @param report - Current carbon report for context
 * @param goals - User's active goals
 * @param recommendations - User's recommendations
 * @param apiKey - Optional API key override
 * @returns AI-generated response string
 */
export async function sendMessage(
  message: string,
  report: CarbonReport | null,
  goals: Goal[],
  recommendations: Recommendation[],
  apiKey?: string
): Promise<string> {
  // Rate limiting check
  if (!checkRateLimit('gemini-chat', RATE_LIMIT_MAX_CALLS, RATE_LIMIT_WINDOW_MS)) {
    return '⏳ You\'re sending messages too quickly. Please wait a moment and try again.';
  }

  // Sanitize user input
  const sanitizedMessage = sanitizeUserInput(message, MAX_MESSAGE_LENGTH);
  if (!sanitizedMessage) {
    return 'Please enter a valid message to get started! 💚';
  }

  // If no API key or AI not initialized, use fallback
  if (!apiKey && !aiInstance) {
    return getFallbackResponse(sanitizedMessage, report);
  }

  // Initialize if needed
  if (!aiInstance && apiKey) {
    const success = await initializeGemini(apiKey);
    if (!success) return getFallbackResponse(sanitizedMessage, report);
  }

  try {
    const context = buildUserContext(report, goals, recommendations);
    const fullPrompt = `${SYSTEM_PROMPT}\n\n${context}\n\nUser: ${sanitizedMessage}`;

    const response = await callGemini(fullPrompt);

    return response.text || getFallbackResponse(sanitizedMessage, report);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.warn('Gemini API error:', errorMessage);

    if (errorMessage === 'Request timed out') {
      return '⏱️ The request took too long. Please try again in a moment.';
    }

    return getFallbackResponse(sanitizedMessage, report);
  }
}

/**
 * Generate an AI-powered weekly summary of the user's sustainability progress.
 * Uses Gemini to create personalized insights from the user's data.
 *
 * @param report - Current carbon report
 * @param goals - User's goals
 * @param recommendations - User's recommendations
 * @param apiKey - Gemini API key
 * @returns AI-generated weekly summary string
 */
export async function generateWeeklySummary(
  report: CarbonReport | null,
  goals: Goal[],
  recommendations: Recommendation[],
  apiKey?: string
): Promise<string> {
  if (!report) {
    return '📊 Complete your carbon assessment to receive weekly AI-powered insights!';
  }

  if (!checkRateLimit('gemini-summary', SUMMARY_RATE_LIMIT, RATE_LIMIT_WINDOW_MS)) {
    return getWeeklySummaryFallback(report, goals, recommendations);
  }

  if (!aiInstance && apiKey) {
    const success = await initializeGemini(apiKey);
    if (!success) return getWeeklySummaryFallback(report, goals, recommendations);
  }

  if (!aiInstance) {
    return getWeeklySummaryFallback(report, goals, recommendations);
  }

  try {
    const context = buildUserContext(report, goals, recommendations);
    const summaryPrompt = `${SYSTEM_PROMPT}\n\n${context}\n\nGenerate a brief, encouraging weekly sustainability summary for this user. Include:\n1. A one-line highlight of their progress\n2. Their top achievement this week\n3. One specific, actionable suggestion for next week\nKeep it under 100 words. Be warm and motivating.`;

    const response = await callGemini(summaryPrompt);

    return response.text || getWeeklySummaryFallback(report, goals, recommendations);
  } catch {
    return getWeeklySummaryFallback(report, goals, recommendations);
  }
}

/**
 * Generate AI-powered personalized recommendations based on the user's profile.
 *
 * @param report - Current carbon report
 * @param apiKey - Gemini API key
 * @returns Array of recommendation strings
 */
export async function generateAIRecommendations(
  report: CarbonReport | null,
  apiKey?: string
): Promise<string[]> {
  if (!report) return getDefaultRecommendations();

  if (!aiInstance && apiKey) {
    await initializeGemini(apiKey);
  }

  if (!aiInstance) return getDefaultRecommendations();

  try {
    const topCategory = report.breakdown[0]?.label || 'general';
    const prompt = `Based on a user whose highest carbon category is "${topCategory}" at ${report.breakdown[0]?.kgCO2e} kg CO₂e/year (total footprint: ${report.totalTonnesCO2e} tonnes/year), suggest 5 specific, actionable recommendations. Return ONLY a JSON array of strings, no other text. Each recommendation should be one concise sentence.`;

    const response = await callGemini(prompt);

    const text = response.text || '';
    try {
      const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim());
      if (Array.isArray(parsed)) return parsed.slice(0, 5);
    } catch {
      // If JSON parsing fails, split by newlines
      return text.split('\n').filter((l: string) => l.trim()).slice(0, 5);
    }
  } catch {
    // Silently fall back
  }

  return getDefaultRecommendations();
}

/**
 * Default recommendations when AI is unavailable.
 */
function getDefaultRecommendations(): string[] {
  return [
    'Switch to LED lighting throughout your home to save ~120 kg CO₂/year.',
    'Try one meatless meal per week — it can save ~150 kg CO₂/year.',
    'Unplug devices on standby to save ~90 kg CO₂/year.',
    'Use public transport once a week instead of driving.',
    'Buy local and seasonal produce to reduce food transport emissions.',
  ];
}

/**
 * Get suggested prompts based on user context.
 * Provides contextual conversation starters for the AI Coach.
 *
 * @param report - User's current carbon report (nullable)
 * @returns Array of suggested prompt strings
 */
export function getSuggestedPrompts(report: CarbonReport | null): string[] {
  if (!report) {
    return [
      'What is a carbon footprint?',
      'How can I start reducing my impact?',
      'What everyday actions matter most?',
      'Explain carbon emissions in simple terms',
    ];
  }

  const topCategory = report.breakdown[0]?.label || 'Transportation';
  return [
    `Why is my ${topCategory.toLowerCase()} impact so high?`,
    'What should I focus on first?',
    'Give me 3 easy wins I can start today',
    `How can I reduce my footprint by 20%?`,
    'Is recycling really impactful?',
    'Compare my footprint to the average',
  ];
}

/**
 * Fallback weekly summary when Gemini is unavailable.
 */
function getWeeklySummaryFallback(
  report: CarbonReport,
  goals: Goal[],
  recommendations: Recommendation[]
): string {
  const completedRecs = recommendations.filter((r) => r.completed).length;
  const totalSaved = recommendations
    .filter((r) => r.completed)
    .reduce((s, r) => s + r.estimatedReductionKg, 0);
  const activeGoals = goals.filter((g) => g.status === 'active').length;

  return `📊 **Your Weekly Sustainability Snapshot**\n\n` +
    `🌍 Current footprint: **${report.totalTonnesCO2e} tonnes CO₂e/year**\n` +
    `✅ Recommendations completed: **${completedRecs}** (saving ~${totalSaved} kg CO₂)\n` +
    `🎯 Active goals: **${activeGoals}**\n\n` +
    `💡 *Focus on your top category — ${report.breakdown[0]?.label} — for the biggest impact this week!*`;
}

/**
 * Intelligent fallback responses when API is unavailable.
 * Pattern-matches user messages to provide relevant, pre-written responses.
 *
 * @param message - Sanitized user message
 * @param report - Current carbon report (nullable)
 * @returns Context-appropriate response string
 */
function getFallbackResponse(message: string, report: CarbonReport | null): string {
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes('footprint') || lowerMsg.includes('score') || lowerMsg.includes('how much')) {
    if (report) {
      return `Your estimated annual carbon footprint is **${report.totalTonnesCO2e} tonnes CO₂e/year** (${report.totalKgCO2e} kg). ` +
        `The global average is about ${report.benchmarks.globalAverage / 1000} tonnes.\n\n` +
        `Your top contributor is **${report.breakdown[0]?.label}** at ${report.breakdown[0]?.percentage}%. ` +
        `This is a great area to focus your reduction efforts!\n\n` +
        `💡 *Remember: These are estimates based on available data. The important thing is the trend — are you improving over time?*`;
    }
    return 'Complete your carbon footprint assessment first to get personalized insights! It takes about 5 minutes and covers transportation, diet, energy, and more.';
  }

  if (lowerMsg.includes('transport') || lowerMsg.includes('car') || lowerMsg.includes('commute')) {
    return `**Transportation Tips:**\n\n` +
      `🚶 Walk or bike for trips under 3 km\n` +
      `🚌 Use public transit 2-3 days per week\n` +
      `🚗 Carpool when driving is necessary\n` +
      `⛽ Keep tires inflated and drive smoothly\n\n` +
      `Even replacing **one car trip per week** with public transit saves ~180 kg CO₂/year. That's the equivalent of planting 8 trees! 🌳`;
  }

  if (lowerMsg.includes('food') || lowerMsg.includes('diet') || lowerMsg.includes('meat') || lowerMsg.includes('eat')) {
    return `**Food & Diet Tips:**\n\n` +
      `🥗 Try 1-2 plant-based meals per week\n` +
      `🛒 Buy local and seasonal produce\n` +
      `🍽️ Plan meals to reduce food waste\n` +
      `🌿 Start small — Meatless Mondays are a great entry point!\n\n` +
      `A mixed diet produces about 2,500 kg CO₂e/year. Going vegetarian 2 days/week saves ~200 kg CO₂e annually. That's meaningful progress! 🎉`;
  }

  if (lowerMsg.includes('energy') || lowerMsg.includes('electric') || lowerMsg.includes('power')) {
    return `**Energy Saving Tips:**\n\n` +
      `💡 Switch to LED bulbs (uses 75% less energy)\n` +
      `🔌 Unplug devices on standby\n` +
      `🌡️ Adjust thermostat by just 2°C\n` +
      `👕 Air-dry clothes when possible\n\n` +
      `Small changes in energy use add up. LEDs alone can save ~120 kg CO₂e per year!`;
  }

  if (lowerMsg.includes('first') || lowerMsg.includes('start') || lowerMsg.includes('begin') || lowerMsg.includes('easy')) {
    return `**Great question! Here are 3 easy wins to start today:**\n\n` +
      `1. 🔌 **Unplug standby devices** — saves ~90 kg CO₂/year (free!)\n` +
      `2. 🥗 **Try one meatless meal this week** — saves ~150 kg CO₂/year\n` +
      `3. 🚶 **Walk one short trip instead of driving** — immediate impact\n\n` +
      `You've already taken the hardest step by understanding your impact. Every small action, repeated consistently, creates meaningful change. 💚`;
  }

  if (lowerMsg.includes('reduce') || lowerMsg.includes('lower') || lowerMsg.includes('decrease')) {
    const target = report ? Math.round(report.totalKgCO2e * DEFAULT_REDUCTION_TARGET) : FALLBACK_REDUCTION_KG;
    return `**To reduce your footprint by ~15% (${target} kg CO₂/year):**\n\n` +
      `Focus on your highest-impact category first. The biggest wins usually come from:\n\n` +
      `1. 🚗 **Transportation** — Use public transit 2x/week\n` +
      `2. 🍖 **Diet** — 2 plant-based meals/week\n` +
      `3. ⚡ **Energy** — LED bulbs + unplug standby devices\n\n` +
      `These three changes alone can save 500+ kg CO₂e/year. Start with whichever feels most doable for you! 🎯`;
  }

  // Default encouraging response
  return `Great question! 🌍\n\nHere's what I'd suggest:\n\n` +
    `1. **Start with awareness** — Complete your assessment to understand your footprint\n` +
    `2. **Pick one area** — Focus on your highest-impact category\n` +
    `3. **Set a small goal** — Consistency beats intensity\n` +
    `4. **Track progress** — Use the tracker to see your improvement\n\n` +
    `Remember: sustainability is a journey, not a destination. Every action counts! 💚\n\n` +
    `*Tip: Try asking me about specific categories like transportation, food, or energy for tailored advice.*`;
}

/**
 * Check if Gemini API key is configured in environment variables.
 *
 * @returns True if a valid API key is present
 */
export function isGeminiConfigured(): boolean {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  return Boolean(key && key.length > 0);
}

/**
 * Get the API key from environment variables.
 *
 * @returns The API key string, or undefined if not set
 */
export function getApiKey(): string | undefined {
  return import.meta.env.VITE_GEMINI_API_KEY;
}
