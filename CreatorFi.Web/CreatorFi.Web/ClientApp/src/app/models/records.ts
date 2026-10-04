export type Section =
  | 'overview'
  | 'influencers'
  | 'brands'
  | 'campaigns'
  | 'coaching'
  | 'vetting'
  | 'applications'
  | 'plans';

export type CreatorSection = 'overview' | 'analytics' | 'account' | 'brands' | 'sars' | 'coaching';

export type InfluencerStatus = 'active' | 'pending' | 'inactive';
export type BrandStatus = 'active' | 'paused';
export type CampaignStatus = 'live' | 'draft' | 'completed';
export type ApplicationStatus = 'pending' | 'accepted' | 'declined';
export type VettingStatus = 'vetted' | 'pending-review';
export type CoachingStatus = 'in-progress' | 'completed';

export interface Influencer {
  name: string;
  handle: string;
  avatar: string;
  followers: string;
  engagement: number;
  platform: string;
  niche: string;
  status: InfluencerStatus;
  campaigns: number;
  earnings: string;
  plan: string;
}

export interface Brand {
  name: string;
  industry: string;
  budget: string;
  campaigns: number;
  influencers: number;
  status: BrandStatus;
  logo: string;
  rating: number;
}

export interface Campaign {
  name: string;
  brand: string;
  status: CampaignStatus;
  progress: number;
  budget: string;
  spent: string;
  influencers: number;
  reach: string;
  startDate: string;
  endDate: string;
}

export interface ActivityItem {
  text: string;
  time: string;
  type: 'campaign' | 'brand' | 'milestone';
}

export interface CoachingRecord {
  name: string;
  avatar: string;
  handle: string;
  stage: string;
  progress: number;
  coach: string;
  sessions: number;
  nextSession: string;
  notes: string;
  status: CoachingStatus;
}

export interface VettingRecord {
  name: string;
  avatar: string;
  handle: string;
  followers: string;
  engagement: number;
  platform: string;
  vettedDate: string;
  vettedBy: string;
  authenticity: number;
  brandSafe: boolean;
  status: VettingStatus;
}

export interface ApplicationRecord {
  id: string;
  name: string;
  avatar: string;
  email: string;
  handle: string;
  followers: string;
  platform: string;
  niche: string;
  appliedDate: string;
  message: string;
  portfolio: string;
  engagement: number;
  status: ApplicationStatus;
  idDocumentUrl: string;
}

export interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: readonly string[];
  highlighted: boolean;
  badge: string | null;
  cta: string;
}

export interface NavChild {
  title: string;
  badge?: string;
}

export interface NavEntry {
  title: string;
  section: Section;
  icon: string;
  badge?: string;
  items?: readonly NavChild[];
}

export function initials(name: string): string {
  const letters = name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');
  return letters || 'NA';
}

export function statusTone(status: string): string {
  switch (status) {
    case 'active':
    case 'live':
    case 'vetted':
    case 'accepted':
    case 'received':
      return 'good';
    case 'pending':
    case 'draft':
    case 'pending-review':
    case 'in-progress':
    case 'wrapping up':
      return 'warn';
    case 'inactive':
    case 'paused':
    case 'declined':
      return 'bad';
    case 'completed':
      return 'info';
    default:
      return 'neutral';
  }
}

export function platformTone(platform: string): string {
  switch (platform) {
    case 'Instagram':
      return 'pink';
    case 'YouTube':
      return 'red';
    case 'Twitter':
      return 'sky';
    case 'Facebook':
      return 'blue';
    default:
      return 'ink';
  }
}
