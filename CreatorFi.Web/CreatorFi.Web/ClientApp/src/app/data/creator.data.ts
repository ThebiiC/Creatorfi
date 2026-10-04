import { CreatorSection } from '../models/records';

export interface CreatorProfile {
  name: string;
  handle: string;
  avatar: string;
  plan: string;
  location: string;
  idVerified: boolean;
  idMasked: string;
}

export interface PlatformStat {
  key: string;
  icon: string;
  tone: string;
  locked: boolean;
  followers: string;
  engagement: number;
  reach: string;
  posts: number;
  growth: readonly number[];
}

export interface TopPost {
  title: string;
  reach: string;
  likes: string;
  engagement: number;
}

export interface Deliverable {
  task: string;
  due: string;
  done: boolean;
}

export interface CreatorBrand {
  name: string;
  logo: string;
  status: string;
  importance: 'High' | 'Medium' | 'Low';
  nextDue: string;
  fee: string;
  deliverables: Deliverable[];
}

export interface Payment {
  brand: string;
  amount: string;
  date: string;
  status: 'received' | 'pending';
  method: string;
  hasProof: boolean;
}

export interface UpcomingTask {
  date: string;
  task: string;
  importance: 'High' | 'Medium' | 'Low';
}

export interface BrandMatch {
  name: string;
  industry: string;
  match: number;
  reason: string;
}

export interface ChecklistItem {
  step: string;
  done: boolean;
}

export interface Course {
  title: string;
  duration: string;
  category: string;
  tag: string | null;
}

export interface CreatorCoaching {
  stage: string;
  progress: number;
  coach: string;
  sessions: number;
  nextSession: string;
}

export const EMPTY_PROFILE: CreatorProfile = {
  name: '',
  handle: '',
  avatar: '',
  plan: 'Free',
  location: '',
  idVerified: false,
  idMasked: '',
};

const blankGrowth = [0, 0, 0, 0, 0, 0, 0] as const;

export const PLATFORM_DEFAULTS: readonly PlatformStat[] = [
  { key: 'Instagram', icon: 'camera', tone: 'pink', locked: false, followers: '0', engagement: 0, reach: '0', posts: 0, growth: blankGrowth },
  { key: 'Twitter', icon: 'twitter', tone: 'sky', locked: true, followers: '0', engagement: 0, reach: '0', posts: 0, growth: blankGrowth },
  { key: 'Facebook', icon: 'facebook', tone: 'blue', locked: true, followers: '0', engagement: 0, reach: '0', posts: 0, growth: blankGrowth },
  { key: 'Other', icon: 'sparkles', tone: 'violet', locked: true, followers: '0', engagement: 0, reach: '0', posts: 0, growth: blankGrowth },
];

export const SARS_STEPS: readonly ChecklistItem[] = [
  { step: 'Register as a taxpayer with SARS', done: false },
  { step: 'Register as a provisional taxpayer', done: false },
  { step: 'Keep records of all brand income', done: false },
  { step: 'Log deductible expenses (gear, data, travel)', done: false },
  { step: 'Submit first provisional return (IRP6)', done: false },
  { step: 'Watch for VAT registration (R1m turnover)', done: false },
];

export const COURSES: readonly Course[] = [
  { title: 'Why being tax compliant protects your money', duration: '8 min', category: 'SARS', tag: 'Start here' },
  { title: 'Deductions creators miss (legally lower your tax)', duration: '12 min', category: 'SARS', tag: 'Popular' },
  { title: 'Building a media kit that wins brand deals', duration: '15 min', category: 'Growth', tag: null },
  { title: 'Negotiating your rate with brands', duration: '10 min', category: 'Business', tag: null },
];

export const CREATOR_NAV: readonly { title: string; section: CreatorSection; icon: string; badge?: string }[] = [
  { title: 'Overview', section: 'overview' as const, icon: 'home' },
  { title: 'Analytics', section: 'analytics' as const, icon: 'chart' },
  { title: 'My Account', section: 'account' as const, icon: 'users' },
  { title: 'Brands', section: 'brands' as const, icon: 'building' },
  { title: 'SARS Compliance', section: 'sars' as const, icon: 'shield' },
  { title: 'Coaching', section: 'coaching' as const, icon: 'graduation' },
];

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
