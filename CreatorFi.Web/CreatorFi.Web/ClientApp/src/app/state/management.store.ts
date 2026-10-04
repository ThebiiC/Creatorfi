import { computed, inject, signal, Service } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api, Mutation, showApiError } from '../api';
import { Auth } from './auth.service';
import { MANAGEMENT_NAV, PLAN_COLORS, PLANS } from '../data/management.data';
import {
  ActivityItem,
  ApplicationRecord,
  ApplicationStatus,
  Brand,
  Campaign,
  CoachingRecord,
  Influencer,
  InfluencerStatus,
  NavEntry,
  Plan,
  Section,
  VettingRecord,
} from '../models/records';
import { Toasts } from './toast.service';

interface WorkspaceSnapshot {
  influencers: Influencer[];
  applications: ApplicationRecord[];
  coaching: CoachingRecord[];
  vetting: VettingRecord[];
  activity: ActivityItem[];
  brands: Brand[];
  campaigns: Campaign[];
  currentPlan: string;
  plans: Plan[];
}

function countLabel(count: number): string | undefined {
  return count > 0 ? String(count) : undefined;
}

function parseMoney(value: string): number {
  const amount = Number(value.replace(/[^0-9.]/g, ''));
  return Number.isFinite(amount) ? amount : 0;
}

function formatMoney(value: number): string {
  if (value >= 1_000_000) {
    return `R${(value / 1_000_000).toFixed(1)}M`;
  }
  return `R${Math.round(value).toLocaleString('en-ZA')}`;
}

@Service()
export class ManagementStore {
  private readonly api = inject(Api);
  private readonly toasts = inject(Toasts);
  private readonly auth = inject(Auth);

  readonly section = signal<Section>('overview');
  readonly sidebarQuery = signal('');
  readonly expanded = signal<Readonly<Record<string, boolean>>>({});
  readonly influencerFilter = signal<'all' | InfluencerStatus>('all');
  readonly influencerQuery = signal('');
  readonly brandFilter = signal<'all' | 'active' | 'paused'>('all');
  readonly brandQuery = signal('');
  readonly campaignFilter = signal<'all' | 'live' | 'draft' | 'completed'>('all');
  readonly campaignQuery = signal('');
  readonly influencers = signal<Influencer[]>([]);
  readonly brands = signal<Brand[]>([]);
  readonly campaigns = signal<Campaign[]>([]);
  readonly applications = signal<ApplicationRecord[]>([]);
  readonly coaching = signal<CoachingRecord[]>([]);
  readonly vetting = signal<VettingRecord[]>([]);
  readonly activity = signal<ActivityItem[]>([]);
  readonly plans = signal<Plan[]>(PLANS.map((item) => ({ ...item, features: [...item.features] })));
  readonly currentPlan = signal('Starter');
  readonly onboardOpen = signal(false);
  readonly brandFormOpen = signal(false);
  readonly applicationFormOpen = signal(false);
  readonly campaignFormOpen = signal(false);
  readonly assignOpen = signal(false);

  readonly pendingCount = computed(
    () => this.applications().filter((item) => item.status === 'pending').length,
  );

  readonly stats = computed(() => [
    { label: 'Total Influencers', value: String(this.influencers().length), icon: 'users' },
    { label: 'Active Brands', value: String(this.brands().filter((item) => item.status === 'active').length), icon: 'building' },
    { label: 'Live Campaigns', value: String(this.campaigns().filter((item) => item.status === 'live').length), icon: 'target' },
    { label: 'Campaign Spend', value: formatMoney(this.campaigns().reduce((sum, item) => sum + parseMoney(item.spent), 0)), icon: 'dollar' },
  ]);

  readonly liveCampaigns = computed(() => this.campaigns().filter((item) => item.status === 'live'));

  readonly planDistribution = computed(() => {
    const people = this.influencers();
    return PLAN_COLORS.map(({ plan, color }) => {
      const count = people.filter((person) => person.plan === plan).length;
      const pct = people.length ? Math.round((count / people.length) * 100) : 0;
      return { plan, color, count, pct };
    });
  });

  readonly nav = computed(() => {
    const query = this.sidebarQuery().trim().toLowerCase();
    const entries = this.withBadges(MANAGEMENT_NAV);
    if (!query) {
      return entries;
    }
    return entries.filter((entry) => {
      const title = entry.title.toLowerCase().includes(query);
      const child = entry.items?.some((item) => item.title.toLowerCase().includes(query));
      return title || child;
    });
  });

  readonly visibleInfluencers = computed(() => {
    const filter = this.influencerFilter();
    const query = this.influencerQuery().trim().toLowerCase();
    return this.influencers().filter((item) => {
      const statusOk = filter === 'all' || item.status === filter;
      const text = `${item.name} ${item.handle} ${item.niche} ${item.platform}`.toLowerCase();
      return statusOk && (!query || text.includes(query));
    });
  });

  readonly visibleBrands = computed(() => {
    const filter = this.brandFilter();
    const query = this.brandQuery().trim().toLowerCase();
    return this.brands().filter((item) => {
      const statusOk = filter === 'all' || item.status === filter;
      const text = `${item.name} ${item.industry}`.toLowerCase();
      return statusOk && (!query || text.includes(query));
    });
  });

  readonly visibleCampaigns = computed(() => {
    const filter = this.campaignFilter();
    const query = this.campaignQuery().trim().toLowerCase();
    return this.campaigns().filter((item) => {
      const statusOk = filter === 'all' || item.status === filter;
      const text = `${item.name} ${item.brand}`.toLowerCase();
      return statusOk && (!query || text.includes(query));
    });
  });

  constructor() {
    if (this.auth.isManager()) {
      this.load();
    }
  }

  openSection(section: Section): void {
    this.section.set(section);
  }

  toggleGroup(entry: NavEntry): void {
    this.openSection(entry.section);
    if (!entry.items) {
      return;
    }
    this.expanded.update((current) => ({ ...current, [entry.title]: !current[entry.title] }));
  }

  selectChild(entry: NavEntry, childTitle: string): void {
    this.openSection(entry.section);
    if (entry.section === 'influencers') {
      if (childTitle === 'All Influencers') this.influencerFilter.set('all');
      if (childTitle === 'Active') this.influencerFilter.set('active');
      if (childTitle === 'Pending') this.influencerFilter.set('pending');
    }
    if (entry.section === 'brands') {
      if (childTitle === 'All Brands') this.brandFilter.set('all');
      if (childTitle === 'Active Partners') this.brandFilter.set('active');
    }
    if (entry.section === 'campaigns') {
      if (childTitle === 'All Campaigns') this.campaignFilter.set('all');
      if (childTitle === 'Live') this.campaignFilter.set('live');
      if (childTitle === 'Drafts') this.campaignFilter.set('draft');
    }
    if (childTitle === 'Completed') {
      queueMicrotask(() => document.getElementById('coaching-completed')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
    if (childTitle === 'Pending Review') {
      queueMicrotask(() => document.getElementById('pending-review')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
    if (childTitle === 'Accepted' || childTitle === 'Declined' || childTitle === 'Billing History') {
      const id = childTitle === 'Billing History' ? 'plan-distribution' : childTitle.toLowerCase();
      queueMicrotask(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  }

  setApplicationStatus(id: string, status: ApplicationStatus): void {
    const current = this.applications().find((item) => item.id === id);
    if (!current || current.status === status) {
      return;
    }
    this.mutate(this.api.patch(`/api/workspace/applications/${encodeURIComponent(id)}/status`, { status }));
  }

  addApplication(form: HTMLFormElement): void {
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const handle = String(data.get('handle') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    if (!name || !handle || !email) {
      this.toasts.show('Missing details', 'Name, handle, and email are required.');
      return;
    }
    this.mutate(
      this.api.post('/api/workspace/applications', {
        name,
        handle,
        email,
        followers: String(data.get('followers') ?? ''),
        platform: String(data.get('platform') ?? ''),
        niche: String(data.get('niche') ?? ''),
        message: String(data.get('message') ?? ''),
        portfolio: String(data.get('portfolio') ?? ''),
        engagement: Number(data.get('engagement') || 0),
      }),
      () => {
        this.applicationFormOpen.set(false);
        form.reset();
      },
    );
  }

  addInfluencer(form: HTMLFormElement): void {
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const handle = String(data.get('handle') ?? '').trim();
    if (!name || !handle) {
      this.toasts.show('Missing details', 'Name and handle are required to onboard an influencer.');
      return;
    }
    this.mutate(
      this.api.post('/api/workspace/influencers', {
        name,
        handle,
        followers: String(data.get('followers') ?? ''),
        engagement: Number(data.get('engagement') || 0),
        platform: String(data.get('platform') ?? ''),
        niche: String(data.get('niche') ?? ''),
      }),
      () => {
        this.onboardOpen.set(false);
        form.reset();
      },
    );
  }

  reviewVetting(handle: string, approve: boolean): void {
    this.mutate(this.api.post('/api/workspace/vetting/review', { handle, approve }));
  }

  assignCoach(form: HTMLFormElement): void {
    const data = new FormData(form);
    const handle = String(data.get('handle') ?? '');
    const coach = String(data.get('coach') ?? '').trim();
    if (!handle || !coach) {
      this.toasts.show('Missing details', 'Choose an influencer and enter a coach name.');
      return;
    }
    this.mutate(
      this.api.post('/api/workspace/coaching', {
        handle,
        coach,
        stage: String(data.get('stage') ?? ''),
        notes: String(data.get('notes') ?? ''),
      }),
      () => {
        this.assignOpen.set(false);
        form.reset();
      },
    );
  }

  completeCoaching(handle: string): void {
    this.mutate(this.api.post('/api/workspace/coaching/complete', { handle }));
  }

  addBrand(form: HTMLFormElement): void {
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    if (!name) {
      this.toasts.show('Missing details', 'Brand name is required.');
      return;
    }
    this.mutate(
      this.api.post('/api/workspace/brands', {
        name,
        industry: String(data.get('industry') ?? ''),
        budget: String(data.get('budget') ?? ''),
        influencers: Number(data.get('influencers') || 0),
      }),
      () => {
        this.brandFormOpen.set(false);
        form.reset();
      },
    );
  }

  addCampaign(form: HTMLFormElement): void {
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const brand = String(data.get('brand') ?? '').trim();
    if (!name || !brand) {
      this.toasts.show('Missing details', 'Campaign name and brand are required.');
      return;
    }
    this.mutate(
      this.api.post('/api/workspace/campaigns', {
        name,
        brand,
        budget: String(data.get('budget') ?? ''),
      }),
      () => {
        this.campaignFormOpen.set(false);
        form.reset();
      },
    );
  }

  choosePlan(name: string): void {
    this.mutate(this.api.put('/api/workspace/plan', { name }));
  }

  load(): void {
    this.api.get<WorkspaceSnapshot>('/api/workspace').subscribe({
      next: (snapshot) => this.apply(snapshot),
      error: () => this.toasts.show('API unavailable', 'Start CreatorFi.Api so this workspace can load and save.'),
    });
  }

  private mutate(request: Observable<Mutation<WorkspaceSnapshot>>, done?: () => void): void {
    request.subscribe({
      next: (result) => {
        this.apply(result.snapshot);
        done?.();
        if (result.toastTitle) {
          this.toasts.show(result.toastTitle, result.toastMessage ?? '');
        }
      },
      error: (error: HttpErrorResponse) => showApiError(error, this.toasts),
    });
  }

  private apply(snapshot: WorkspaceSnapshot): void {
    this.influencers.set(snapshot.influencers ?? []);
    this.applications.set(snapshot.applications ?? []);
    this.coaching.set(snapshot.coaching ?? []);
    this.vetting.set(snapshot.vetting ?? []);
    this.activity.set(snapshot.activity ?? []);
    this.brands.set(snapshot.brands ?? []);
    this.campaigns.set(snapshot.campaigns ?? []);
    this.currentPlan.set(snapshot.currentPlan || 'Starter');
    if (snapshot.plans?.length) {
      this.plans.set(snapshot.plans);
    }
  }

  private withBadges(entries: readonly NavEntry[]): NavEntry[] {
    const influencers = this.influencers();
    const brands = this.brands();
    const campaigns = this.campaigns();
    const coaching = this.coaching();
    const vetting = this.vetting();
    const applications = this.applications();
    return entries.map((entry) => {
      if (entry.section === 'influencers') {
        return {
          ...entry,
          badge: countLabel(influencers.length),
          items: entry.items?.map((child) => ({
            ...child,
            badge:
              child.title === 'Active'
                ? countLabel(influencers.filter((item) => item.status === 'active').length)
                : child.title === 'Pending'
                  ? countLabel(influencers.filter((item) => item.status === 'pending').length)
                  : undefined,
          })),
        };
      }
      if (entry.section === 'brands') {
        return {
          ...entry,
          badge: countLabel(brands.length),
          items: entry.items?.map((child) => ({
            ...child,
            badge: child.title === 'Active Partners' ? countLabel(brands.filter((item) => item.status === 'active').length) : undefined,
          })),
        };
      }
      if (entry.section === 'campaigns') {
        return {
          ...entry,
          badge: countLabel(campaigns.length),
          items: entry.items?.map((child) => ({
            ...child,
            badge:
              child.title === 'Live'
                ? countLabel(campaigns.filter((item) => item.status === 'live').length)
                : child.title === 'Drafts'
                  ? countLabel(campaigns.filter((item) => item.status === 'draft').length)
                  : undefined,
          })),
        };
      }
      if (entry.section === 'coaching') {
        return {
          ...entry,
          badge: countLabel(coaching.filter((item) => item.status === 'in-progress').length),
          items: entry.items?.map((child) => ({
            ...child,
            badge:
              child.title === 'In Progress'
                ? countLabel(coaching.filter((item) => item.status === 'in-progress').length)
                : child.title === 'Completed'
                  ? countLabel(coaching.filter((item) => item.status === 'completed').length)
                  : undefined,
          })),
        };
      }
      if (entry.section === 'vetting') {
        return {
          ...entry,
          badge: countLabel(vetting.filter((item) => item.status === 'pending-review').length),
          items: entry.items?.map((child) => ({
            ...child,
            badge:
              child.title === 'Vetted'
                ? countLabel(vetting.filter((item) => item.status === 'vetted').length)
                : child.title === 'Pending Review'
                  ? countLabel(vetting.filter((item) => item.status === 'pending-review').length)
                  : undefined,
          })),
        };
      }
      if (entry.section === 'applications') {
        return {
          ...entry,
          badge: countLabel(applications.filter((item) => item.status === 'pending').length),
          items: entry.items?.map((child) => ({
            ...child,
            badge:
              child.title === 'Pending'
                ? countLabel(applications.filter((item) => item.status === 'pending').length)
                : child.title === 'Accepted'
                  ? countLabel(applications.filter((item) => item.status === 'accepted').length)
                  : child.title === 'Declined'
                    ? countLabel(applications.filter((item) => item.status === 'declined').length)
                    : undefined,
          })),
        };
      }
      return { ...entry, items: entry.items?.map((child) => ({ ...child })) };
    });
  }
}
