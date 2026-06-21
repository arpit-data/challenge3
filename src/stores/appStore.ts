/**
 * @fileoverview EcoPulse AI — Application Store (Zustand).
 * Centralized state management with localStorage persistence for carbon data,
 * user profile, goals, achievements, challenges, and assessment progress.
 */

/** All EcoPulse localStorage key prefixes for targeted cleanup */
const ECOPULSE_STORAGE_KEYS = [
  'ecopulse-user',
  'ecopulse-assessment',
  'ecopulse-carbon',
  'ecopulse-goals',
  'ecopulse-challenges',
  'ecopulse-achievements',
  'ecopulse-chat',
] as const;

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  UserProfile,
  AssessmentData,
  CarbonReport,
  Recommendation,
  Goal,
  GoalCheckin,
  ChallengeProgress,
  Achievement,
  ChatMessage,
} from '../types';
import { generateCarbonReport } from '../engine/carbonCalculator';
import { getDefaultAssessment } from '../data/defaults';
import { BUILT_IN_RECOMMENDATIONS } from '../data/recommendations';
import { checkAchievements } from '../data/achievements';
import { MAX_REPORT_HISTORY, MAX_RECOMMENDATIONS, PROGRESS_INCREMENT } from '../constants';

// ---- User Store ----

/** State and actions for user authentication and profile management */
interface UserState {
  /** Current logged-in user profile, or null if unauthenticated */
  user: UserProfile | null;
  /** Whether a user is currently authenticated */
  isAuthenticated: boolean;
  /** Log in with a display name and optional email */
  login: (name: string, email?: string) => void;
  /** Log out and clear user session */
  logout: () => void;
  /** Update user preference fields (partial update) */
  updatePreferences: (prefs: Partial<UserProfile['preferences']>) => void;
  /** Permanently delete account and clear all EcoPulse data */
  deleteAccount: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (name, email) =>
        set({
          isAuthenticated: true,
          user: {
            id: crypto.randomUUID(),
            displayName: name,
            email,
            createdAt: new Date().toISOString(),
            assessmentCompleted: false,
            preferences: { theme: 'light', units: 'metric', notifications: true },
          },
        }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updatePreferences: (prefs) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, preferences: { ...state.user.preferences, ...prefs } }
            : null,
        })),
      deleteAccount: () => {
        // Remove only EcoPulse-specific keys, not all localStorage
        ECOPULSE_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
        set({ user: null, isAuthenticated: false });
        window.location.reload();
      },
    }),
    { name: 'ecopulse-user', storage: createJSONStorage(() => localStorage) }
  )
);

// ---- Assessment Store ----

/** State and actions for the multi-step carbon assessment form */
interface AssessmentState {
  /** Current assessment wizard step index */
  currentStep: number;
  /** Assessment form data across all sections */
  assessment: AssessmentData;
  /** Whether the assessment has been completed and submitted */
  isCompleted: boolean;
  /** Navigate to a specific assessment step */
  setStep: (step: number) => void;
  /** Update a specific section of the assessment data */
  updateSection: <K extends keyof AssessmentData>(
    section: K,
    data: Partial<AssessmentData[K]>
  ) => void;
  /** Finalize assessment, generate carbon report and recommendations */
  completeAssessment: () => void;
  /** Reset assessment to initial state for re-assessment */
  resetAssessment: () => void;
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      assessment: getDefaultAssessment(),
      isCompleted: false,
      setStep: (step) => set({ currentStep: step }),
      updateSection: (section, data) =>
        set((state) => ({
          assessment: {
            ...state.assessment,
            [section]: Object.assign({}, state.assessment[section], data),
          },
        })),
      completeAssessment: () => {
        const assessment = get().assessment;
        const completedAssessment = { ...assessment, completedAt: new Date().toISOString() };
        
        // Generate report
        const report = generateCarbonReport(completedAssessment);
        useCarbonStore.getState().setReport(report);
        
        // Generate initial recommendations
        const recs = generateRecommendations(report);
        useCarbonStore.getState().setRecommendations(recs);
        
        // Mark user assessment as completed
        useUserStore.setState((state) => ({
          user: state.user ? { ...state.user, assessmentCompleted: true } : null,
        }));
        
        set({ isCompleted: true, assessment: completedAssessment });
      },
      resetAssessment: () =>
        set({ currentStep: 0, assessment: getDefaultAssessment(), isCompleted: false }),
    }),
    { name: 'ecopulse-assessment', storage: createJSONStorage(() => localStorage) }
  )
);

// ---- Carbon Store ----



/** State and actions for carbon reports and recommendations */
interface CarbonState {
  /** The most recent carbon footprint report */
  currentReport: CarbonReport | null;
  /** Historical reports for trend tracking */
  reportHistory: CarbonReport[];
  /** Personalized recommendations based on the assessment */
  recommendations: Recommendation[];
  /** Set the current report and archive it to history */
  setReport: (report: CarbonReport) => void;
  /** Replace all recommendations */
  setRecommendations: (recs: Recommendation[]) => void;
  /** Mark a recommendation as completed */
  completeRecommendation: (id: string) => void;
  /** Calculate total CO₂ saved from completed recommendations */
  totalCO2Saved: () => number;
}

export const useCarbonStore = create<CarbonState>()(
  persist(
    (set, get) => ({
      currentReport: null,
      reportHistory: [],
      recommendations: [],
      setReport: (report) =>
        set((state) => ({
          currentReport: report,
          reportHistory: [report, ...state.reportHistory].slice(0, MAX_REPORT_HISTORY),
        })),
      setRecommendations: (recs) => set({ recommendations: recs }),
      completeRecommendation: (id) =>
        set((state) => ({
          recommendations: state.recommendations.map((r) =>
            r.id === id ? { ...r, completed: true, completedAt: new Date().toISOString() } : r
          ),
        })),
      totalCO2Saved: () => {
        const recs = get().recommendations.filter((r) => r.completed);
        return recs.reduce((sum, r) => sum + r.estimatedReductionKg, 0);
      },
    }),
    { name: 'ecopulse-carbon', storage: createJSONStorage(() => localStorage) }
  )
);

// ---- Goal Store ----



/** State and actions for sustainability goal tracking */
interface GoalState {
  /** All user goals (active, paused, completed) */
  goals: Goal[];
  /** Create a new goal with initial defaults */
  addGoal: (goal: Omit<Goal, 'id' | 'streak' | 'bestStreak' | 'progress' | 'status' | 'checkins'>) => void;
  /** Record a daily check-in on a goal */
  checkinGoal: (goalId: string, notes?: string) => void;
  /** Toggle pause/active status of a goal */
  pauseGoal: (goalId: string) => void;
  /** Remove a goal permanently */
  removeGoal: (goalId: string) => void;
}

export const useGoalStore = create<GoalState>()(
  persist(
    (set) => ({
      goals: [],
      addGoal: (goalData) =>
        set((state) => ({
          goals: [
            ...state.goals,
            {
              ...goalData,
              id: crypto.randomUUID(),
              streak: 0,
              bestStreak: 0,
              progress: 0,
              status: 'active',
              checkins: [],
            },
          ],
        })),
      checkinGoal: (goalId, notes) =>
        set((state) => ({
          goals: state.goals.map((g) => {
            if (g.id !== goalId) return g;
            const today = new Date().toISOString().split('T')[0];
            const alreadyChecked = g.checkins.some(
              (c) => c.date.split('T')[0] === today && c.completed
            );
            if (alreadyChecked) return g;

            const newCheckin: GoalCheckin = {
              date: new Date().toISOString(),
              completed: true,
              notes,
            };
            const newStreak = g.streak + 1;
            return {
              ...g,
              streak: newStreak,
              bestStreak: Math.max(g.bestStreak, newStreak),
              progress: Math.min(100, g.progress + PROGRESS_INCREMENT),
              checkins: [...g.checkins, newCheckin],
            };
          }),
        })),
      pauseGoal: (goalId) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === goalId ? { ...g, status: g.status === 'paused' ? 'active' : 'paused' } : g
          ),
        })),
      removeGoal: (goalId) =>
        set((state) => ({ goals: state.goals.filter((g) => g.id !== goalId) })),
    }),
    { name: 'ecopulse-goals', storage: createJSONStorage(() => localStorage) }
  )
);

// ---- Challenge Store ----

/** State and actions for tracking user participation in sustainability challenges */
interface ChallengeState {
  activeProgresses: ChallengeProgress[];
  startChallenge: (challengeId: string) => void;
  completeChallengeDay: (challengeId: string, day: number) => void;
  abandonChallenge: (challengeId: string) => void;
}

export const useChallengeStore = create<ChallengeState>()(
  persist(
    (set) => ({
      activeProgresses: [],
      startChallenge: (challengeId) =>
        set((state) => ({
          activeProgresses: [
            ...state.activeProgresses,
            {
              challengeId,
              startDate: new Date().toISOString(),
              completedDays: [],
              status: 'active',
            },
          ],
        })),
      completeChallengeDay: (challengeId, day) =>
        set((state) => ({
          activeProgresses: state.activeProgresses.map((p) =>
            p.challengeId === challengeId
              ? { ...p, completedDays: [...new Set([...p.completedDays, day])] }
              : p
          ),
        })),
      abandonChallenge: (challengeId) =>
        set((state) => ({
          activeProgresses: state.activeProgresses.map((p) =>
            p.challengeId === challengeId ? { ...p, status: 'abandoned' } : p
          ),
        })),
    }),
    { name: 'ecopulse-challenges', storage: createJSONStorage(() => localStorage) }
  )
);

// ---- Achievement Store ----

interface AchievementState {
  unlockedAchievements: Achievement[];
  checkAndUnlock: () => Achievement[];
}

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      unlockedAchievements: [],
      checkAndUnlock: () => {
        const currentReport = useCarbonStore.getState().currentReport;
        const goals = useGoalStore.getState().goals;
        const recs = useCarbonStore.getState().recommendations;
        const alreadyUnlocked = get().unlockedAchievements.map((a) => a.id);

        const newlyUnlocked = checkAchievements(
          currentReport,
          goals,
          recs,
          alreadyUnlocked
        );

        if (newlyUnlocked.length > 0) {
          set((state) => ({
            unlockedAchievements: [...state.unlockedAchievements, ...newlyUnlocked],
          }));
        }

        return newlyUnlocked;
      },
    }),
    { name: 'ecopulse-achievements', storage: createJSONStorage(() => localStorage) }
  )
);

// ---- Chat Store ----

/** State and actions for the AI Coach chat conversation history */
interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setLoading: (loading: boolean) => void;
  clearHistory: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      isLoading: false,
      addMessage: (msg) =>
        set((state) => ({
          messages: [
            ...state.messages,
            { ...msg, id: crypto.randomUUID(), timestamp: new Date().toISOString() },
          ],
        })),
      setLoading: (loading) => set({ isLoading: loading }),
      clearHistory: () => set({ messages: [] }),
    }),
    { name: 'ecopulse-chat', storage: createJSONStorage(() => localStorage) }
  )
);

// ---- Helper: Generate recommendations from report ----

function generateRecommendations(report: CarbonReport): Recommendation[] {
  const sorted = [...report.breakdown].sort((a, b) => b.kgCO2e - a.kgCO2e);
  const topCategories = sorted.slice(0, 3).map((b) => b.category);

  return BUILT_IN_RECOMMENDATIONS
    .filter((r) => topCategories.includes(r.category))
    .slice(0, MAX_RECOMMENDATIONS)
    .map((r) => ({ ...r, id: crypto.randomUUID(), completed: false }));
}
