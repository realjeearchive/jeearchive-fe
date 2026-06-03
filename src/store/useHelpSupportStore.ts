// src/store/useHelpSupportStore.ts

import { create } from 'zustand';
import { sendEmailToSupport } from '@/features/helpSupport/api';

interface HelpSupportState {
  // State
  isSubmitting: boolean;
  error: string | null;
  
  // Actions
  submitBugReport: (description: string, type: "TechnicalGlitch" | "Review") => Promise<boolean>;
  clearError: () => void;
}

export const useHelpSupportStore = create<HelpSupportState>((set, get) => ({
  // Initial state
  isSubmitting: false,
  error: null,
  
  // Submit bug report
  submitBugReport: async (description: string, type: "TechnicalGlitch" | "Review") => {
    if (!description.trim()) {
      set({ error: 'Please describe the issue before submitting.' });
      return false;
    }

    set({ isSubmitting: true, error: null });
    
    try {
      // 🔥 NEW: Pass both content and type in the payload
      const payload = { 
        content: description.trim(),
        type: type 
      };
      
      console.log("[Store] Sending payload:", payload);
      
      const response = await sendEmailToSupport(payload);
      
      console.log("[Store] Received response:", response);
      
      if (response.success) {
        set({ isSubmitting: false, error: null });
        return true;
      } else {
        set({ 
          isSubmitting: false, 
          error: response.message || 'Failed to submit bug report.' 
        });
        return false;
      }
    } catch (error: unknown) {
      console.error("[Store] Error submitting bug report:", error);
      
      let errorMessage = 'An unexpected error occurred.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String((error as Record<string, unknown>).message);
      }
      
      set({ 
        isSubmitting: false, 
        error: errorMessage 
      });
      return false;
    }
  },
  
  // Clear error
  clearError: () => {
    set({ error: null });
  }
}));