/**
 * Application State Management Hook
 *
 * @description
 * Consolidates multiple useState hooks into useReducer for better performance
 * and maintainability. Provides a centralized state management solution.
 *
 * @module hooks/useAppState
 */

import { useReducer, useCallback } from 'react';
import { CatEmotion, PaymentMethod } from '@/types';
import { PAYMENT_CONFIG, getRandomSuccessEmotion } from '@/config/payment.config';

/**
 * Application state structure
 */
interface AppState {
  /** Currently selected QR code payment method */
  selectedQr: PaymentMethod | null;
  /** Current cat emotion state */
  catEmotion: CatEmotion;
  /** Show thank you modal */
  showThankYou: boolean;
  /** Show message wall modal */
  showMessageWall: boolean;
  /** Show custom quotes editor */
  showCustomQuotes: boolean;
  /** Show mobile stats panel */
  showMobileStats: boolean;
  /** Last donation information */
  lastDonation: {
    amount: number;
    method: string;
  } | null;
}

/**
 * Application state actions
 */
type AppAction =
  | { type: 'SELECT_QR'; payload: PaymentMethod | null }
  | { type: 'SET_CAT_EMOTION'; payload: CatEmotion }
  | { type: 'SHOW_THANK_YOU'; payload: { amount: number; method: string } }
  | { type: 'HIDE_THANK_YOU' }
  | { type: 'SHOW_MESSAGE_WALL' }
  | { type: 'HIDE_MESSAGE_WALL' }
  | { type: 'SHOW_CUSTOM_QUOTES' }
  | { type: 'HIDE_CUSTOM_QUOTES' }
  | { type: 'TOGGLE_MOBILE_STATS' }
  | { type: 'RESET_CAT_EMOTION' };

/**
 * Initial application state
 */
const initialState: AppState = {
  selectedQr: null,
  catEmotion: PAYMENT_CONFIG.DEFAULT_EMOTION,
  showThankYou: false,
  showMessageWall: false,
  showCustomQuotes: false,
  showMobileStats: false,
  lastDonation: null,
};

/**
 * Application state reducer
 *
 * @param {AppState} state - Current state
 * @param {AppAction} action - Action to process
 * @returns {AppState} New state
 */
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SELECT_QR':
      return { ...state, selectedQr: action.payload };

    case 'SET_CAT_EMOTION':
      return { ...state, catEmotion: action.payload };

    case 'SHOW_THANK_YOU':
      return {
        ...state,
        showThankYou: true,
        lastDonation: { amount: action.payload.amount, method: action.payload.method },
        catEmotion: getRandomSuccessEmotion(),
      };

    case 'HIDE_THANK_YOU':
      return { ...state, showThankYou: false };

    case 'SHOW_MESSAGE_WALL':
      return { ...state, showMessageWall: true };

    case 'HIDE_MESSAGE_WALL':
      return { ...state, showMessageWall: false };

    case 'SHOW_CUSTOM_QUOTES':
      return { ...state, showCustomQuotes: true };

    case 'HIDE_CUSTOM_QUOTES':
      return { ...state, showCustomQuotes: false };

    case 'TOGGLE_MOBILE_STATS':
      return { ...state, showMobileStats: !state.showMobileStats };

    case 'RESET_CAT_EMOTION':
      return { ...state, catEmotion: PAYMENT_CONFIG.DEFAULT_EMOTION };

    default:
      return state;
  }
}

/**
 * Action creators object type
 */
interface AppStateActions {
  selectQr: (method: PaymentMethod | null) => void;
  setCatEmotion: (emotion: CatEmotion) => void;
  showThankYou: (amount: number, method: string) => void;
  hideThankYou: () => void;
  showMessageWall: () => void;
  hideMessageWall: () => void;
  showCustomQuotes: () => void;
  hideCustomQuotes: () => void;
  toggleMobileStats: () => void;
  resetCatEmotion: () => void;
}

/**
 * Application state management hook
 *
 * @returns {{
 *   state: AppState;
 *   actions: AppStateActions;
 * }} State and action creators
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { state, actions } = useAppState();
 *
 *   return (
 *     <button onClick={actions.showMessageWall}>
 *       Open Message Wall
 *     </button>
 *   );
 * }
 * ```
 */
export function useAppState(): { state: AppState; actions: AppStateActions } {
  const [state, dispatch] = useReducer(appReducer, initialState);

  /**
   * Action creators with useCallback for stability
   */
  const selectQr = useCallback((method: PaymentMethod | null) =>
    dispatch({ type: 'SELECT_QR', payload: method }), []);

  const setCatEmotion = useCallback((emotion: CatEmotion) =>
    dispatch({ type: 'SET_CAT_EMOTION', payload: emotion }), []);

  const showThankYou = useCallback((amount: number, method: string) =>
    dispatch({ type: 'SHOW_THANK_YOU', payload: { amount, method } }), []);

  const hideThankYou = useCallback(() =>
    dispatch({ type: 'HIDE_THANK_YOU' }), []);

  const showMessageWall = useCallback(() =>
    dispatch({ type: 'SHOW_MESSAGE_WALL' }), []);

  const hideMessageWall = useCallback(() =>
    dispatch({ type: 'HIDE_MESSAGE_WALL' }), []);

  const showCustomQuotes = useCallback(() =>
    dispatch({ type: 'SHOW_CUSTOM_QUOTES' }), []);

  const hideCustomQuotes = useCallback(() =>
    dispatch({ type: 'HIDE_CUSTOM_QUOTES' }), []);

  const toggleMobileStats = useCallback(() =>
    dispatch({ type: 'TOGGLE_MOBILE_STATS' }), []);

  const resetCatEmotion = useCallback(() =>
    dispatch({ type: 'RESET_CAT_EMOTION' }), []);

  const actions: AppStateActions = {
    selectQr,
    setCatEmotion,
    showThankYou,
    hideThankYou,
    showMessageWall,
    hideMessageWall,
    showCustomQuotes,
    hideCustomQuotes,
    toggleMobileStats,
    resetCatEmotion,
  };

  return { state, actions };
}
