export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  image?: string;
  bio?: string;
}

export interface Club {
  id: string;
  name: string;
  icon: string;
  members: number;
  description: string;
  tags: string[];
  color: string;
  about: string;
  establishedYear: number;
  president: TeamMember;
  vicePresident?: TeamMember;
  teamMembers: TeamMember[];
  gallery: string[];
  achievements: string[];
  events: string[];
  contactEmail: string;
  contactPhone?: string;
  social?: {
    instagram?: string;
    linkedin?: string;
    discord?: string;
  };
}

const CLUBS_KEY = 'campus_connect_clubs';

export const clubService = {
  // Initialize clubs
  initialize: () => {
    const stored = localStorage.getItem(CLUBS_KEY);
    if (!stored) {
      const defaultClubs: Club[] = [
        {
          id: '1',
          name: 'Coding Club',
          icon: '💻',
          members: 250,
          description: 'Learn, code, and build amazing projects together',
          tags: ['Programming', 'Web Dev', 'AI/ML'],
          color: 'bg-gradient-to-br from-primary to-primary/70',
          about: 'The Coding Club is dedicated to fostering a community of developers who are passionate about technology and innovation. We organize workshops, hackathons, and coding competitions to help members enhance their skills.',
          establishedYear: 2019,
          president: {
            id: '1',
            name: 'Rajesh Kumar',
            role: 'President',
            email: 'rajesh@campus.edu',
            phone: '+91-9876543210',
            bio: 'Full Stack Developer with 3+ years of experience'
          },
          vicePresident: {
            id: '2',
            name: 'Priya Singh',
            role: 'Vice President',
            email: 'priya@campus.edu',
            bio: 'AI/ML Enthusiast'
          },
          teamMembers: [
            { id: '3', name: 'Amit Patel', role: 'Web Dev Lead' },
            { id: '4', name: 'Neha Gupta', role: 'AI/ML Lead' },
            { id: '5', name: 'Vikram Sharma', role: 'Event Manager' },
            { id: '6', name: 'Ananya Verma', role: 'Treasurer' }
          ],
          gallery: [
            'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500',
            'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500',
            'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500',
            'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500'
          ],
          achievements: [
            'Won 1st Prize in National Hackathon 2024',
            'Organized 25+ coding workshops',
            'Mentored 100+ students in web development',
            'Launched open-source projects with 500+ stars'
          ],
          events: [
            'Weekly coding sessions',
            'Monthly hackathons',
            'Quarterly workshops on trending technologies',
            'Annual flagship hackathon event'
          ],
          contactEmail: 'coding.club@campus.edu',
          contactPhone: '+91-XXXX-XXXX',
          social: {
            instagram: 'https://instagram.com/codingclub',
            linkedin: 'https://linkedin.com/company/codingclub',
            discord: 'https://discord.gg/codingclub'
          }
        },
        {
          id: '2',
          name: 'Design Society',
          icon: '🎨',
          members: 180,
          description: 'Where creativity meets technology in UI/UX design',
          tags: ['UI/UX', 'Graphic Design', 'Figma'],
          color: 'bg-gradient-to-br from-accent to-accent/70',
          about: 'Design Society is a creative hub for designers of all levels. We believe in pushing creative boundaries and learning from each other\'s work.',
          establishedYear: 2020,
          president: {
            id: '7',
            name: 'Sarah Chen',
            role: 'President',
            email: 'sarah@campus.edu',
            bio: 'Product Designer with experience at startups'
          },
          teamMembers: [
            { id: '8', name: 'Marcus Johnson', role: 'Design Lead' },
            { id: '9', name: 'Elena Rodriguez', role: 'Graphics Lead' },
            { id: '10', name: 'Aisha Patel', role: 'Event Coordinator' }
          ],
          gallery: [
            'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500',
            'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500',
            'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500'
          ],
          achievements: [
            'Won Design Excellence Award 2024',
            'Created design system used by 5+ student projects',
            'Conducted 15+ design workshops',
            'Gallery exhibition in main campus hall'
          ],
          events: [
            'Weekly design challenges',
            'Monthly design critiques',
            'Figma masterclasses',
            'Annual design showcase'
          ],
          contactEmail: 'design.society@campus.edu',
          social: {
            instagram: 'https://instagram.com/designsociety',
            linkedin: 'https://linkedin.com/company/designsociety'
          }
        }
      ];
      localStorage.setItem(CLUBS_KEY, JSON.stringify(defaultClubs));
    }
  },

  // Get all clubs
  getAllClubs: (): Club[] => {
    const stored = localStorage.getItem(CLUBS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  // Get club by ID
  getClubById: (id: string): Club | undefined => {
    const clubs = clubService.getAllClubs();
    return clubs.find(club => club.id === id);
  },

  // Add new club
  addClub: (club: Omit<Club, 'id'>): Club => {
    const clubs = clubService.getAllClubs();
    const newClub: Club = {
      ...club,
      id: `club_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    clubs.push(newClub);
    localStorage.setItem(CLUBS_KEY, JSON.stringify(clubs));
    return newClub;
  },

  // Update club
  updateClub: (id: string, updates: Partial<Club>): Club | undefined => {
    const clubs = clubService.getAllClubs();
    const index = clubs.findIndex(club => club.id === id);
    if (index !== -1) {
      clubs[index] = { ...clubs[index], ...updates };
      localStorage.setItem(CLUBS_KEY, JSON.stringify(clubs));
      return clubs[index];
    }
    return undefined;
  },

  // Delete club
  deleteClub: (id: string): boolean => {
    const clubs = clubService.getAllClubs();
    const filtered = clubs.filter(club => club.id !== id);
    if (filtered.length < clubs.length) {
      localStorage.setItem(CLUBS_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  }
};
