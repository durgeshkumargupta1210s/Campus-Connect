export interface ClubApplication {
  id: string;
  clubId: string;
  clubName: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  universityRollNumber: string;
  year: string;
  teamInterest: string;
  resume: string; // base64 or file URL
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

const STORAGE_KEY = 'campus_connect_club_applications';

export const clubApplicationService = {
  initialize: () => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
  },

  getAllApplications: (): ClubApplication[] => {
    clubApplicationService.initialize();
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getApplicationsByClubId: (clubId: string): ClubApplication[] => {
    const applications = clubApplicationService.getAllApplications();
    return applications.filter(app => app.clubId === clubId);
  },

  getApplicationById: (id: string): ClubApplication | null => {
    const applications = clubApplicationService.getAllApplications();
    return applications.find(app => app.id === id) || null;
  },

  addApplication: (application: Omit<ClubApplication, 'id' | 'applicationDate'>): ClubApplication => {
    const applications = clubApplicationService.getAllApplications();
    const newApplication: ClubApplication = {
      ...application,
      id: `app-${Date.now()}`,
      applicationDate: new Date().toISOString(),
    };
    applications.push(newApplication);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    return newApplication;
  },

  updateApplicationStatus: (id: string, status: 'pending' | 'approved' | 'rejected'): ClubApplication | null => {
    const applications = clubApplicationService.getAllApplications();
    const application = applications.find(app => app.id === id);
    if (!application) return null;
    application.status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    return application;
  },

  deleteApplication: (id: string): boolean => {
    const applications = clubApplicationService.getAllApplications();
    const filtered = applications.filter(app => app.id !== id);
    if (filtered.length === applications.length) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },
};
