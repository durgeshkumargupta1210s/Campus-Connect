// Opportunity & Campus Drive Service
// Manages job opportunities and campus drives

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  type: "Job" | "Internship" | "Fellowship";
  ctc?: string;
  stipend?: string;
  positions: number;
  jobProfile: string;
  eligibility: string;
  applyLink: string;
  deadline: string;
  description: string;
  location: string;
  tags: string[];
  status: "Active" | "Closed" | "Upcoming";
  postedDate: Date;
  skills?: string[];
  experience?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface CampusDrive {
  id: string;
  company: string;
  driveDate: string;
  registrationDeadline: string;
  expectedTime?: string;
  venue: string;
  description: string;
  positions: number;
  ctc?: string;
  eligibility: string;
  roles: string[];
  registrationLink: string;
  status: "Upcoming" | "Ongoing" | "Completed";
  createdDate: Date;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  recruitmentProcess?: string;
  tags?: string[];
}

const OPPORTUNITIES_KEY = 'campus_connect_opportunities';
const CAMPUS_DRIVES_KEY = 'campus_connect_campus_drives';

export const opportunityService = {
  // Initialize service
  initialize: () => {
    const opportStored = localStorage.getItem(OPPORTUNITIES_KEY);
    const drivesStored = localStorage.getItem(CAMPUS_DRIVES_KEY);
    
    if (!opportStored) {
      localStorage.setItem(OPPORTUNITIES_KEY, JSON.stringify([]));
    }
    if (!drivesStored) {
      localStorage.setItem(CAMPUS_DRIVES_KEY, JSON.stringify([]));
    }
  },

  // ===== OPPORTUNITIES =====

  // Add new opportunity
  addOpportunity: (data: Omit<Opportunity, 'id' | 'postedDate'>): Opportunity => {
    const opportunities = opportunityService.getAllOpportunities();

    const newOpportunity: Opportunity = {
      id: `opp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...data,
      postedDate: new Date()
    };

    opportunities.push(newOpportunity);
    localStorage.setItem(OPPORTUNITIES_KEY, JSON.stringify(opportunities));

    console.log(`✅ Opportunity added: ${data.title}`);
    return newOpportunity;
  },

  // Get all opportunities
  getAllOpportunities: (): Opportunity[] => {
    const stored = localStorage.getItem(OPPORTUNITIES_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  // Get active opportunities
  getActiveOpportunities: (): Opportunity[] => {
    const all = opportunityService.getAllOpportunities();
    return all.filter(opp => opp.status === "Active").sort((a, b) => 
      new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
    );
  },

  // Get upcoming opportunities
  getUpcomingOpportunities: (): Opportunity[] => {
    const all = opportunityService.getAllOpportunities();
    return all.filter(opp => opp.status === "Upcoming").sort((a, b) => 
      new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
    );
  },

  // Get by type
  getOpportunitiesByType: (type: "Job" | "Internship" | "Fellowship"): Opportunity[] => {
    return opportunityService.getAllOpportunities().filter(opp => opp.type === type && opp.status === "Active");
  },

  // Get opportunity by ID
  getOpportunityById: (id: string): Opportunity | undefined => {
    return opportunityService.getAllOpportunities().find(opp => opp.id === id);
  },

  // Update opportunity
  updateOpportunity: (id: string, updates: Partial<Opportunity>): Opportunity | null => {
    const opportunities = opportunityService.getAllOpportunities();
    const index = opportunities.findIndex(opp => opp.id === id);

    if (index === -1) return null;

    opportunities[index] = { ...opportunities[index], ...updates };
    localStorage.setItem(OPPORTUNITIES_KEY, JSON.stringify(opportunities));

    console.log(`✅ Opportunity updated: ${id}`);
    return opportunities[index];
  },

  // Delete opportunity
  deleteOpportunity: (id: string): boolean => {
    const opportunities = opportunityService.getAllOpportunities();
    const filtered = opportunities.filter(opp => opp.id !== id);

    if (filtered.length === opportunities.length) return false;

    localStorage.setItem(OPPORTUNITIES_KEY, JSON.stringify(filtered));
    console.log(`✅ Opportunity deleted: ${id}`);
    return true;
  },

  // ===== CAMPUS DRIVES =====

  // Add new campus drive
  addCampusDrive: (data: Omit<CampusDrive, 'id' | 'createdDate'>): CampusDrive => {
    const drives = opportunityService.getAllCampusDrives();

    const newDrive: CampusDrive = {
      id: `drive_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...data,
      createdDate: new Date()
    };

    drives.push(newDrive);
    localStorage.setItem(CAMPUS_DRIVES_KEY, JSON.stringify(drives));

    console.log(`✅ Campus drive added: ${data.company}`);
    return newDrive;
  },

  // Get all campus drives
  getAllCampusDrives: (): CampusDrive[] => {
    const stored = localStorage.getItem(CAMPUS_DRIVES_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  // Get upcoming campus drives
  getUpcomingCampusDrives: (): CampusDrive[] => {
    const all = opportunityService.getAllCampusDrives();
    return all.filter(drive => drive.status === "Upcoming").sort((a, b) => 
      new Date(a.driveDate).getTime() - new Date(b.driveDate).getTime()
    );
  },

  // Get ongoing campus drives
  getOngoingCampusDrives: (): CampusDrive[] => {
    const all = opportunityService.getAllCampusDrives();
    return all.filter(drive => drive.status === "Ongoing");
  },

  // Get campus drive by ID
  getCampusDriveById: (id: string): CampusDrive | undefined => {
    return opportunityService.getAllCampusDrives().find(drive => drive.id === id);
  },

  // Update campus drive
  updateCampusDrive: (id: string, updates: Partial<CampusDrive>): CampusDrive | null => {
    const drives = opportunityService.getAllCampusDrives();
    const index = drives.findIndex(drive => drive.id === id);

    if (index === -1) return null;

    drives[index] = { ...drives[index], ...updates };
    localStorage.setItem(CAMPUS_DRIVES_KEY, JSON.stringify(drives));

    console.log(`✅ Campus drive updated: ${id}`);
    return drives[index];
  },

  // Delete campus drive
  deleteCampusDrive: (id: string): boolean => {
    const drives = opportunityService.getAllCampusDrives();
    const filtered = drives.filter(drive => drive.id !== id);

    if (filtered.length === drives.length) return false;

    localStorage.setItem(CAMPUS_DRIVES_KEY, JSON.stringify(filtered));
    console.log(`✅ Campus drive deleted: ${id}`);
    return true;
  },

  // Clear all (for testing)
  clearAll: () => {
    localStorage.removeItem(OPPORTUNITIES_KEY);
    localStorage.removeItem(CAMPUS_DRIVES_KEY);
    localStorage.setItem(OPPORTUNITIES_KEY, JSON.stringify([]));
    localStorage.setItem(CAMPUS_DRIVES_KEY, JSON.stringify([]));
    console.log("✅ All opportunities and drives cleared");
  }
};
