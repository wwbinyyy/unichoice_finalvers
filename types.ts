export interface Alumni {
  name: string;
  role: string;
  company: string;
  result: string;
  photo: string;
  linkedin: string;
}

export interface University {
  id: string;
  name: string;
  location: string;
  country: string;
  description: string;
  tuition: number; // Annual tuition in USD
  ranking: number; // Global ranking
  acceptanceRate: number; // Percentage
  majors: string[];
  imageUrl: string;
  website: string;
  // Added for full functionality
  hasScholarship?: boolean;
  degreeLevels?: string[];
  alumni?: Alumni[];
  // Added for details page
  admissionRequirements?: string | Record<string, any>;
  deadlines?: Record<string, string> | any[];
  languages?: string[];
  internationalStudentsPercent?: number;
}

export interface FilterState {
  search: string;
  maxTuition: number;
  minRanking: number;
  locations: string[]; // Changed to array for multi-select
  majors: string[];    // Changed to array for multi-select
  // Added for full functionality
  hasScholarship: boolean;
  degreeLevel: string[]; // Changed to array for multi-select
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}