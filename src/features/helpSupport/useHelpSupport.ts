// src/features/helpSupport/useHelpSupport.ts

import { useCallback } from 'react';
import { useHelpSupportStore } from '@/store/useHelpSupportStore';
import { toast } from 'sonner';

export const useHelpSupport = () => {
  const isSubmitting = useHelpSupportStore((state) => state.isSubmitting);
  const error = useHelpSupportStore((state) => state.error);
  const submitBugReport = useHelpSupportStore((state) => state.submitBugReport);
  const clearError = useHelpSupportStore((state) => state.clearError);

  const handleSubmitBugReport = useCallback(async (description: string, type: "TechnicalGlitch" | "Review") => {
    // 🔥 NEW: Passing type to the store action
    const success = await submitBugReport(description, type);
    
    if (success) {
      toast.success(type === "Review" ? 'Review submitted successfully!' : 'Bug report submitted successfully!');
    } else {
      toast.error('Failed to submit. Please try again.');
    }
    
    return success;
  }, [submitBugReport]);

  return {
    isSubmitting,
    error,
    handleSubmitBugReport,
    clearError
  };
};