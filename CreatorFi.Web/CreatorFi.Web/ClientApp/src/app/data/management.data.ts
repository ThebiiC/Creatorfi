import { Brand, Campaign, NavEntry, Plan } from '../models/records';

export const BRANDS: readonly Brand[] = [
  { name: 'Luxe Beauty Co.', industry: 'Beauty & Cosmetics', budget: 'R120,000', campaigns: 6, influencers: 14, status: 'active', logo: 'LB', rating: 4.9 },
  { name: 'TechNova Inc.', industry: 'Technology', budget: 'R250,000', campaigns: 4, influencers: 8, status: 'active', logo: 'TN', rating: 4.7 },
  { name: 'FitLife Pro', industry: 'Health & Fitness', budget: 'R85,000', campaigns: 3, influencers: 10, status: 'active', logo: 'FL', rating: 4.8 },
  { name: 'Wanderlust Travel', industry: 'Travel & Tourism', budget: 'R180,000', campaigns: 5, influencers: 12, status: 'paused', logo: 'WT', rating: 4.5 },
  { name: 'GreenEarth Foods', industry: 'Food & Beverage', budget: 'R95,000', campaigns: 2, influencers: 6, status: 'active', logo: 'GE', rating: 4.6 },
  { name: 'UrbanThread', industry: 'Fashion & Apparel', budget: 'R200,000', campaigns: 7, influencers: 18, status: 'active', logo: 'UT', rating: 4.8 },
];

export const CAMPAIGNS: readonly Campaign[] = [
  { name: 'Summer Glow Collection', brand: 'Luxe Beauty Co.', status: 'live', progress: 72, budget: 'R45,000', spent: 'R32,400', influencers: 6, reach: '4.2M', startDate: 'Jan 15, 2026', endDate: 'Mar 15, 2026' },
  { name: 'TechNova Launch Event', brand: 'TechNova Inc.', status: 'live', progress: 45, budget: 'R80,000', spent: 'R36,000', influencers: 4, reach: '2.8M', startDate: 'Feb 1, 2026', endDate: 'Apr 30, 2026' },
  { name: '30-Day Fitness Challenge', brand: 'FitLife Pro', status: 'completed', progress: 100, budget: 'R30,000', spent: 'R28,500', influencers: 5, reach: '3.5M', startDate: 'Nov 1, 2025', endDate: 'Dec 1, 2025' },
  { name: 'Explore the World Series', brand: 'Wanderlust Travel', status: 'draft', progress: 10, budget: 'R60,000', spent: 'R0', influencers: 0, reach: '0', startDate: 'Apr 1, 2026', endDate: 'Jun 30, 2026' },
  { name: 'Spring Fashion Drop', brand: 'UrbanThread', status: 'live', progress: 58, budget: 'R55,000', spent: 'R31,900', influencers: 8, reach: '5.1M', startDate: 'Jan 20, 2026', endDate: 'Mar 20, 2026' },
];

export const PLANS: readonly Plan[] = [
  {
    name: 'Starter',
    price: 'R29',
    period: '/month',
    description: 'Perfect for emerging influencers just getting started',
    features: ['Up to 5 brand connections', 'Basic analytics dashboard', 'Email support', '1 campaign at a time', 'Standard profile listing'],
    highlighted: false,
    badge: null,
    cta: 'Get Started',
  },
  {
    name: 'Pro',
    price: 'R79',
    period: '/month',
    description: 'For growing influencers ready to scale their partnerships',
    features: ['Up to 25 brand connections', 'Advanced analytics & insights', 'Priority email & chat support', '5 concurrent campaigns', 'Featured profile listing', 'Media kit builder', 'Contract templates'],
    highlighted: true,
    badge: 'Most Popular',
    cta: 'Upgrade to Pro',
  },
  {
    name: 'Business',
    price: 'R199',
    period: '/month',
    description: 'For established influencers managing multiple brand deals',
    features: ['Unlimited brand connections', 'Premium analytics & ROI tracking', 'Dedicated account manager', 'Unlimited campaigns', 'Top-tier profile placement', 'Advanced media kit', 'Custom contract management', 'Revenue forecasting'],
    highlighted: false,
    badge: null,
    cta: 'Go Business',
  },
  {
    name: 'Enterprise',
    price: 'R499',
    period: '/month',
    description: 'For agencies and top-tier creators managing large portfolios',
    features: ['Everything in Business', 'Multi-user team access', 'White-label reporting', 'API access', 'Custom integrations', 'Dedicated success team', 'SLA guarantee', 'Custom billing', 'Brand matchmaking AI'],
    highlighted: false,
    badge: 'For Agencies',
    cta: 'Contact Sales',
  },
];

export const MANAGEMENT_NAV: readonly NavEntry[] = [
  { title: 'Overview', section: 'overview', icon: 'home' },
  {
    title: 'Influencers',
    section: 'influencers',
    icon: 'users',
    items: [
      { title: 'All Influencers' },
      { title: 'Active' },
      { title: 'Pending' },
    ],
  },
  {
    title: 'Brands',
    section: 'brands',
    icon: 'building',
    items: [
      { title: 'All Brands' },
      { title: 'Active Partners' },
    ],
  },
  {
    title: 'Campaigns',
    section: 'campaigns',
    icon: 'target',
    items: [
      { title: 'All Campaigns' },
      { title: 'Live' },
      { title: 'Drafts' },
    ],
  },
  {
    title: 'Coaching',
    section: 'coaching',
    icon: 'graduation',
    items: [{ title: 'In Progress' }, { title: 'Completed' }],
  },
  {
    title: 'Vetting',
    section: 'vetting',
    icon: 'shield',
    items: [{ title: 'Vetted' }, { title: 'Pending Review' }],
  },
  {
    title: 'Applications',
    section: 'applications',
    icon: 'clipboard',
    items: [{ title: 'Pending' }, { title: 'Accepted' }, { title: 'Declined' }],
  },
  {
    title: 'Plans & Billing',
    section: 'plans',
    icon: 'crown',
    items: [{ title: 'Subscription Plans' }, { title: 'Billing History' }],
  },
];

export const PLAN_COLORS = [
  { plan: 'Starter', color: 'slate' },
  { plan: 'Pro', color: 'violet' },
  { plan: 'Business', color: 'teal' },
  { plan: 'Enterprise', color: 'amber' },
] as const;
