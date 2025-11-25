// Group Registration Service
// Manages team-based registrations for group events (hackathons, etc.)

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Leader" | "Member";
}

export interface GroupRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  eventCategory: string;
  teamName: string;
  teamLeader: {
    name: string;
    email: string;
    phone: string;
  };
  teamMembers: TeamMember[];
  totalMembers: number;
  registeredAt: Date;
  status: "Confirmed" | "Pending" | "Cancelled";
}

const GROUP_REGISTRATIONS_KEY = 'campus_connect_group_registrations';

export const groupRegistrationService = {
  // Initialize service
  initialize: () => {
    const stored = localStorage.getItem(GROUP_REGISTRATIONS_KEY);
    if (!stored) {
      localStorage.setItem(GROUP_REGISTRATIONS_KEY, JSON.stringify([]));
    }
  },

  // Register team for event
  registerTeam: (data: {
    eventId: string;
    eventTitle: string;
    eventCategory: string;
    teamName: string;
    teamLeaderName: string;
    teamLeaderEmail: string;
    teamLeaderPhone: string;
    teamMembers: { name: string; email: string; phone: string }[];
  }): GroupRegistration => {
    const registrations = groupRegistrationService.getAllGroupRegistrations();

    // Check if team already registered
    const alreadyRegistered = registrations.some(
      r => r.eventId === data.eventId && r.teamLeader.email === data.teamLeaderEmail
    );

    if (alreadyRegistered) {
      throw new Error('Your team is already registered for this event');
    }

    // Check if team name is unique for this event
    const teamNameExists = registrations.some(
      r => r.eventId === data.eventId && r.teamName.toLowerCase() === data.teamName.toLowerCase()
    );

    if (teamNameExists) {
      throw new Error('Team name already exists for this event');
    }

    // Add leader as team member
    const allMembers: TeamMember[] = [
      {
        id: `member_${Date.now()}_0`,
        name: data.teamLeaderName,
        email: data.teamLeaderEmail,
        phone: data.teamLeaderPhone,
        role: "Leader"
      },
      ...data.teamMembers.map((member, index) => ({
        ...member,
        id: `member_${Date.now()}_${index + 1}`,
        role: "Member" as const
      }))
    ];

    const newRegistration: GroupRegistration = {
      id: `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      eventId: data.eventId,
      eventTitle: data.eventTitle,
      eventCategory: data.eventCategory,
      teamName: data.teamName,
      teamLeader: {
        name: data.teamLeaderName,
        email: data.teamLeaderEmail,
        phone: data.teamLeaderPhone
      },
      teamMembers: allMembers,
      totalMembers: allMembers.length,
      registeredAt: new Date(),
      status: "Confirmed"
    };

    registrations.push(newRegistration);
    localStorage.setItem(GROUP_REGISTRATIONS_KEY, JSON.stringify(registrations));

    console.log(`✅ Team registration successful: ${data.teamName} (${allMembers.length} members) for ${data.eventTitle}`);
    return newRegistration;
  },

  // Get all group registrations
  getAllGroupRegistrations: (): GroupRegistration[] => {
    const stored = localStorage.getItem(GROUP_REGISTRATIONS_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  },

  // Get team registrations for specific event
  getEventTeamRegistrations: (eventId: string): GroupRegistration[] => {
    const allRegistrations = groupRegistrationService.getAllGroupRegistrations();
    return allRegistrations.filter(reg => reg.eventId === eventId);
  },

  // Get team registrations by leader email
  getTeamsByLeader: (email: string): GroupRegistration[] => {
    const allRegistrations = groupRegistrationService.getAllGroupRegistrations();
    return allRegistrations.filter(reg => reg.teamLeader.email === email);
  },

  // Get team count for event
  getEventTeamCount: (eventId: string): number => {
    return groupRegistrationService.getEventTeamRegistrations(eventId).length;
  },

  // Get total participants count for event (all team members)
  getEventParticipantsCount: (eventId: string): number => {
    const teams = groupRegistrationService.getEventTeamRegistrations(eventId);
    return teams.reduce((total, team) => total + team.totalMembers, 0);
  },

  // Check if team already registered by leader email
  isTeamRegistered: (eventId: string, email: string): boolean => {
    const registrations = groupRegistrationService.getAllGroupRegistrations();
    return registrations.some(
      r => r.eventId === eventId && r.teamLeader.email === email
    );
  },

  // Cancel team registration
  cancelTeamRegistration: (registrationId: string): boolean => {
    const registrations = groupRegistrationService.getAllGroupRegistrations();
    const index = registrations.findIndex(reg => reg.id === registrationId);

    if (index === -1) return false;

    registrations[index].status = "Cancelled";
    localStorage.setItem(GROUP_REGISTRATIONS_KEY, JSON.stringify(registrations));

    console.log(`✅ Team registration cancelled: ${registrationId}`);
    return true;
  },

  // Update team registration
  updateTeamRegistration: (registrationId: string, updates: Partial<GroupRegistration>): GroupRegistration | null => {
    const registrations = groupRegistrationService.getAllGroupRegistrations();
    const index = registrations.findIndex(reg => reg.id === registrationId);

    if (index === -1) return null;

    registrations[index] = { ...registrations[index], ...updates };
    localStorage.setItem(GROUP_REGISTRATIONS_KEY, JSON.stringify(registrations));

    console.log(`✅ Team registration updated: ${registrationId}`);
    return registrations[index];
  },

  // Clear all group registrations (for testing)
  clearAll: () => {
    localStorage.removeItem(GROUP_REGISTRATIONS_KEY);
    localStorage.setItem(GROUP_REGISTRATIONS_KEY, JSON.stringify([]));
    console.log("✅ All group registrations cleared");
  }
};
