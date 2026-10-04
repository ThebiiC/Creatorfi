import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, signal, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Api, Mutation, showApiError } from '../api';
import {
  COURSES,
  CREATOR_NAV,
  CreatorBrand,
  CreatorCoaching,
  CreatorProfile,
  Course,
  EMPTY_PROFILE,
  Payment,
  PLATFORM_DEFAULTS,
  PlatformStat,
  SARS_STEPS,
  TopPost,
} from '../data/creator.data';
import { Auth } from './auth.service';
import { CreatorSection } from '../models/records';
import { Toasts } from './toast.service';

interface CreatorSnapshot {
  profile: CreatorProfile;
  platforms: PlatformStat[];
  posts: TopPost[];
  brands: CreatorBrand[];
  payments: Payment[];
  steps: { step: string; done: boolean }[];
  coaching: CreatorCoaching | null;
  courses: Course[];
}

function parseMoney(value: string): number {
  const amount = Number(value.replace(/[^0-9.]/g, ''));
  return Number.isFinite(amount) ? amount : 0;
}

function formatRand(value: number): string {
  return `R${Math.round(value).toLocaleString('en-ZA')}`;
}

@Service()
export class CreatorStore {
  private readonly api = inject(Api);
  private readonly toasts = inject(Toasts);
  private readonly auth = inject(Auth);

  readonly section = signal<CreatorSection>('overview');
  readonly sidebarQuery = signal('');
  readonly platform = signal('Instagram');
  readonly profile = signal<CreatorProfile>({ ...EMPTY_PROFILE });
  readonly platforms = signal<PlatformStat[]>(PLATFORM_DEFAULTS.map((item) => ({ ...item, growth: [...item.growth] })));
  readonly posts = signal<TopPost[]>([]);
  readonly brands = signal<CreatorBrand[]>([]);
  readonly payments = signal<Payment[]>([]);
  readonly steps = signal(SARS_STEPS.map((step) => ({ ...step })));
  readonly coaching = signal<CreatorCoaching | null>(null);
  readonly courses = signal<Course[]>(COURSES.map((item) => ({ ...item })));
  readonly brandFormOpen = signal(false);
  readonly paymentFormOpen = signal(false);
  readonly postFormOpen = signal(false);
  readonly bookOpen = signal(false);

  readonly nav = computed(() => {
    const query = this.sidebarQuery().trim().toLowerCase();
    const brandCount = this.brands().length;
    const entries = CREATOR_NAV.map((item) =>
      item.section === 'brands' && brandCount > 0 ? { ...item, badge: String(brandCount) } : { ...item },
    );
    if (!query) {
      return entries;
    }
    return entries.filter((item) => item.title.toLowerCase().includes(query));
  });

  readonly activePlatform = computed(
    () => this.platforms().find((item) => item.key === this.platform()) ?? this.platforms()[0],
  );

  readonly receivedTotal = computed(() =>
    this.payments()
      .filter((item) => item.status === 'received')
      .reduce((sum, item) => sum + parseMoney(item.amount), 0),
  );

  readonly pendingTotal = computed(() =>
    this.payments()
      .filter((item) => item.status === 'pending')
      .reduce((sum, item) => sum + parseMoney(item.amount), 0),
  );

  readonly receivedLabel = computed(() => formatRand(this.receivedTotal()));
  readonly pendingLabel = computed(() => formatRand(this.pendingTotal()));

  readonly taxpayerRegistered = computed(() => this.steps()[0]?.done ?? false);
  readonly provisionalRegistered = computed(() => this.steps()[1]?.done ?? false);
  readonly compliant = computed(() => this.steps().length > 0 && this.steps().every((step) => step.done));

  constructor() {
    if (this.auth.isManager()) {
      this.load();
    }
  }

  selectPlatform(key: string, locked: boolean): void {
    if (locked) {
      this.toasts.show('Upgrade to add platforms', `The Free plan includes 1 platform. Upgrade to unlock ${key}.`);
      return;
    }
    this.platform.set(key);
  }

  saveProfile(form: HTMLFormElement): void {
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    if (!name) {
      this.toasts.show('Missing details', 'Enter your name to save the profile.');
      return;
    }
    this.mutate(
      this.api.put('/api/creator/profile', {
        name,
        handle: String(data.get('handle') ?? ''),
        location: String(data.get('location') ?? ''),
        idMasked: String(data.get('id') ?? ''),
      }),
    );
  }

  upgrade(): void {
    this.mutate(this.api.post('/api/creator/upgrade', {}));
  }

  updatePlatform(form: HTMLFormElement): void {
    const current = this.activePlatform();
    if (!current || current.locked) {
      this.toasts.show('Platform locked', 'Upgrade before recording stats for this platform.');
      return;
    }
    const data = new FormData(form);
    this.mutate(
      this.api.put(`/api/creator/platforms/${encodeURIComponent(current.key)}`, {
        followers: String(data.get('followers') ?? ''),
        reach: String(data.get('reach') ?? ''),
        engagement: Number(data.get('engagement') || 0),
        posts: Number(data.get('posts') || 0),
      }),
      () => form.reset(),
    );
  }

  addPost(form: HTMLFormElement): void {
    const data = new FormData(form);
    const title = String(data.get('title') ?? '').trim();
    if (!title) {
      this.toasts.show('Missing details', 'Give the post a title.');
      return;
    }
    this.mutate(
      this.api.post('/api/creator/posts', {
        title,
        reach: String(data.get('reach') ?? ''),
        likes: String(data.get('likes') ?? ''),
        engagement: Number(data.get('engagement') || 0),
      }),
      () => {
        this.postFormOpen.set(false);
        form.reset();
      },
    );
  }

  addBrand(form: HTMLFormElement): void {
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const task = String(data.get('task') ?? '').trim();
    const due = String(data.get('due') ?? '').trim();
    if (!name || !task || !due) {
      this.toasts.show('Missing details', 'Brand, deliverable, and due date are required.');
      return;
    }
    this.mutate(
      this.api.post('/api/creator/brands', {
        name,
        task,
        due,
        importance: String(data.get('importance') ?? 'Medium'),
        fee: String(data.get('fee') ?? ''),
      }),
      () => {
        this.brandFormOpen.set(false);
        form.reset();
      },
    );
  }

  addPayment(form: HTMLFormElement): void {
    const data = new FormData(form);
    const brand = String(data.get('brand') ?? '').trim();
    const amount = String(data.get('amount') ?? '').trim();
    if (!brand || !amount) {
      this.toasts.show('Missing details', 'Brand and amount are required.');
      return;
    }
    this.mutate(
      this.api.post('/api/creator/payments', {
        brand,
        amount,
        status: String(data.get('status') ?? 'pending'),
        method: String(data.get('method') ?? ''),
      }),
      () => {
        this.paymentFormOpen.set(false);
        form.reset();
      },
    );
  }

  markProof(brand: string, date: string): void {
    this.mutate(this.api.patch('/api/creator/payments/proof', { brand, date }));
  }

  bookSession(form: HTMLFormElement): void {
    const data = new FormData(form);
    const coach = String(data.get('coach') ?? '').trim();
    if (!coach) {
      this.toasts.show('Missing details', 'Enter a coach name to book a session.');
      return;
    }
    this.mutate(
      this.api.put('/api/creator/coaching', {
        coach,
        stage: String(data.get('stage') ?? ''),
        nextSession: String(data.get('next') ?? ''),
      }),
      () => {
        this.bookOpen.set(false);
        form.reset();
      },
    );
  }

  toggleDeliverable(brandName: string, task: string): void {
    this.mutate(this.api.patch('/api/creator/deliverables', { brandName, task }));
  }

  toggleStep(step: string): void {
    this.mutate(this.api.patch('/api/creator/steps', { step }));
  }

  sendMessage(brandName: string, form: HTMLFormElement): void {
    const data = new FormData(form);
    const message = String(data.get('message') ?? '').trim();
    if (!message) {
      this.toasts.show('Message', `Write a note before sending it to ${brandName}.`);
      return;
    }
    form.reset();
    this.toasts.show('Message sent', `Your note was sent to ${brandName}.`);
  }

  load(): void {
    this.api.get<CreatorSnapshot>('/api/creator').subscribe({
      next: (snapshot) => this.apply(snapshot),
      error: () => this.toasts.show('API unavailable', 'Start CreatorFi.Api so this studio can load and save.'),
    });
  }

  private mutate(request: Observable<Mutation<CreatorSnapshot>>, done?: () => void): void {
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

  private apply(snapshot: CreatorSnapshot): void {
    if (snapshot.profile) {
      this.profile.set({ ...EMPTY_PROFILE, ...snapshot.profile });
    }
    if (snapshot.platforms?.length) {
      this.platforms.set(snapshot.platforms);
    }
    this.posts.set(snapshot.posts ?? []);
    this.brands.set(snapshot.brands ?? []);
    this.payments.set(snapshot.payments ?? []);
    if (snapshot.steps?.length) {
      this.steps.set(snapshot.steps);
    }
    this.coaching.set(snapshot.coaching ?? null);
    if (snapshot.courses?.length) {
      this.courses.set(snapshot.courses);
    }
  }
}
