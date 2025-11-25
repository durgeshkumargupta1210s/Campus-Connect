import { useState, useCallback, useEffect } from 'react';
import { clubApplicationService, ClubApplication } from '@/services/clubApplicationService';

export const useClubApplications = () => {
  const [applications, setApplications] = useState<ClubApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadApplications = useCallback(() => {
    try {
      clubApplicationService.initialize();
      const allApplications = clubApplicationService.getAllApplications();
      setApplications(allApplications);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load applications';
      setError(errorMsg);
    }
  }, []);

  const getApplicationsByClubId = useCallback((clubId: string) => {
    return clubApplicationService.getApplicationsByClubId(clubId);
  }, []);

  const addApplication = useCallback((applicationData: Omit<ClubApplication, 'id' | 'applicationDate'>) => {
    try {
      setError(null);
      setLoading(true);
      const newApplication = clubApplicationService.addApplication(applicationData);
      setApplications(prev => [...prev, newApplication]);
      return { success: true, application: newApplication };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to submit application';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateApplicationStatus = useCallback((id: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      setError(null);
      const updated = clubApplicationService.updateApplicationStatus(id, status);
      if (updated) {
        setApplications(prev => prev.map(app => app.id === id ? updated : app));
        return { success: true, application: updated };
      }
      return { success: false, error: 'Application not found' };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update application';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, []);

  const deleteApplication = useCallback((id: string) => {
    try {
      setError(null);
      const deleted = clubApplicationService.deleteApplication(id);
      if (deleted) {
        setApplications(prev => prev.filter(app => app.id !== id));
        return { success: true };
      }
      return { success: false, error: 'Application not found' };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete application';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, []);

  return {
    applications,
    loading,
    error,
    loadApplications,
    getApplicationsByClubId,
    addApplication,
    updateApplicationStatus,
    deleteApplication,
  };
};
