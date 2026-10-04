import { Component, computed, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { WEEKDAYS } from '../../data/creator.data';
import { platformTone, statusTone } from '../../models/records';
import { CreatorStore } from '../../state/creator.store';
import { Toasts } from '../../state/toast.service';
import { HeroBanner } from '../../ui/hero-banner';
import { Icon } from '../../ui/icon';

@Component({
  selector: 'app-creator-page',
  imports: [HeroBanner, Icon],
  templateUrl: './creator-page.html',
})
export class CreatorPage {
  protected readonly store = inject(CreatorStore);
  private readonly toasts = inject(Toasts);
  protected readonly weekdays = WEEKDAYS;
  protected readonly days = Array.from({ length: 30 }, (_, index) => index + 1);
  protected readonly tone = statusTone;
  protected readonly platformTone = platformTone;
  protected readonly twitterLocked = computed(
    () => this.store.platforms().find((item) => item.key === 'Twitter')?.locked ?? true,
  );
  protected readonly firstName = computed(() => {
    const name = this.store.profile().name.trim();
    return name ? name.split(' ')[0] : '';
  });
  protected readonly welcomeTitle = computed(() =>
    this.firstName() ? `Welcome back, ${this.firstName()}` : 'Welcome to Creator Studio',
  );
  protected readonly accountSubtitle = computed(() => {
    const profile = this.store.profile();
    if (!profile.name) {
      return 'Save your name, handle, and location to personalize this studio.';
    }
    return [profile.name, profile.handle, profile.location].filter(Boolean).join(' · ');
  });
  protected readonly upcoming = computed(() => {
    const tasks: { date: string; task: string; importance: 'High' | 'Medium' | 'Low' }[] = [];
    for (const brand of this.store.brands()) {
      for (const item of brand.deliverables) {
        if (!item.done) {
          tasks.push({ date: item.due, task: `${brand.name} — ${item.task}`, importance: brand.importance });
        }
      }
    }
    return tasks;
  });

  protected readonly tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'analytics' as const, label: 'Analytics' },
    { id: 'account' as const, label: 'My Account' },
    { id: 'brands' as const, label: 'Brands' },
    { id: 'sars' as const, label: 'SARS' },
    { id: 'coaching' as const, label: 'Coaching' },
  ];

  constructor() {
    inject(Title).setTitle('CreatorFi - Creator Studio');
  }

  protected tasksOn(day: number): { label: string; importance: 'High' | 'Medium' | 'Low' }[] {
    const tasks: { label: string; importance: 'High' | 'Medium' | 'Low' }[] = [];
    for (const brand of this.store.brands()) {
      for (const item of brand.deliverables) {
        const match = item.due.match(/\b(\d{1,2})\b/);
        if (match && Number(match[1]) === day) {
          tasks.push({ label: `${brand.name.split(' ')[0]} ${item.task}`, importance: brand.importance });
        }
      }
    }
    return tasks;
  }

  protected play(title: string): void {
    this.toasts.show(title, 'Course playback would open here.');
  }

  protected send(brandName: string, event: Event): void {
    event.preventDefault();
    this.store.sendMessage(brandName, event.target as HTMLFormElement);
  }

  protected saveProfile(event: Event): void {
    event.preventDefault();
    this.store.saveProfile(event.target as HTMLFormElement);
  }

  protected savePlatform(event: Event): void {
    event.preventDefault();
    this.store.updatePlatform(event.target as HTMLFormElement);
  }

  protected savePost(event: Event): void {
    event.preventDefault();
    this.store.addPost(event.target as HTMLFormElement);
  }

  protected saveBrand(event: Event): void {
    event.preventDefault();
    this.store.addBrand(event.target as HTMLFormElement);
  }

  protected savePayment(event: Event): void {
    event.preventDefault();
    this.store.addPayment(event.target as HTMLFormElement);
  }

  protected saveSession(event: Event): void {
    event.preventDefault();
    this.store.bookSession(event.target as HTMLFormElement);
  }
}
