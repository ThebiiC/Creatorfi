import { Component, inject } from '@angular/core';
import { platformTone, statusTone } from '../../models/records';
import { ManagementStore } from '../../state/management.store';
import { Toasts } from '../../state/toast.service';
import { HeroBanner } from '../../ui/hero-banner';
import { Icon } from '../../ui/icon';

@Component({
  selector: 'app-influencers-section',
  imports: [HeroBanner, Icon],
  template: `
    <div class="stack">
      <app-hero-banner
        tone="rose"
        title="Influencer Roster"
        subtitle="Manage your onboarded influencers, track their performance, and grow your network."
      >
        <div heroActions>
          <button type="button" class="btn btn--white-rose" (click)="store.onboardOpen.set(true)">
            <app-icon name="plus" size="sm" /> Onboard Influencer
          </button>
        </div>
      </app-hero-banner>

      <div class="filters">
        @for (filter of filters; track filter) {
          <button type="button" class="btn btn--outline" [class.is-selected]="store.influencerFilter() === filter.id" (click)="store.influencerFilter.set(filter.id)">
            {{ filter.label }}
          </button>
        }
        <label class="search">
          <app-icon name="search" size="sm" />
          <span class="sr-only">Search influencers</span>
          <input type="search" placeholder="Search influencers..." [value]="store.influencerQuery()" (input)="onSearch($event)" />
        </label>
      </div>

      <section class="card-grid">
        @for (person of store.visibleInfluencers(); track person.handle) {
          <article class="card card--hover">
            <div class="card__head">
              <div class="spread">
                <span class="avatar avatar--lg">{{ person.avatar }}</span>
                <div class="end">
                  <span class="badge" [class]="'badge badge--' + tone(person.status)">{{ person.status }}</span>
                  <span class="badge">{{ person.plan }}</span>
                </div>
              </div>
              <h3>{{ person.name }}</h3>
              <p class="muted">{{ person.handle }}</p>
            </div>
            <div class="card__body">
              <div class="grid-2">
                <div class="metric"><span>Followers</span><strong>{{ person.followers }}</strong></div>
                <div class="metric"><span>Engagement</span><strong class="good">{{ person.engagement }}%</strong></div>
              </div>
              <div class="spread muted">
                <span [class]="platform(person.platform)">{{ person.platform }}</span>
                <span>{{ person.niche }}</span>
              </div>
              <div class="spread">
                <span class="muted">{{ person.campaigns }} campaigns</span>
                <strong>{{ person.earnings }}</strong>
              </div>
            </div>
            <div class="card__foot">
              <button type="button" class="btn btn--soft grow" (click)="profile(person.name)">View Profile</button>
              <button type="button" class="icon-btn" style="border: 1px solid var(--line)" [attr.aria-label]="'Message ' + person.name" (click)="message(person.name)">
                <app-icon name="message" size="sm" />
              </button>
            </div>
          </article>
        } @empty {
          <div class="card empty">
            <h3>{{ store.influencers().length ? 'No matches' : 'Roster is empty' }}</h3>
            <p class="muted">{{ store.influencers().length ? 'Try another filter or search.' : 'Onboard an influencer to start the roster.' }}</p>
          </div>
        }
      </section>
    </div>

    @if (store.onboardOpen()) {
      <button type="button" class="drawer-backdrop" aria-label="Close onboarding form" (click)="store.onboardOpen.set(false)"></button>
      <form class="drawer" (submit)="submit($event)" aria-labelledby="onboard-title">
        <h2 id="onboard-title">Manual influencer onboarding</h2>
        <div class="field"><label for="name">Full name</label><input id="name" name="name" required /></div>
        <div class="field"><label for="handle">Handle</label><input id="handle" name="handle" required placeholder="@handle" /></div>
        <div class="form-grid">
          <div class="field"><label for="platform">Platform</label><input id="platform" name="platform" placeholder="Instagram / TikTok / YouTube" /></div>
          <div class="field"><label for="niche">Niche</label><input id="niche" name="niche" placeholder="e.g. Fashion, Tech" /></div>
        </div>
        <div class="form-grid">
          <div class="field"><label for="followers">Followers</label><input id="followers" name="followers" placeholder="e.g. 250K" /></div>
          <div class="field"><label for="engagement">Engagement %</label><input id="engagement" name="engagement" type="number" step="0.1" placeholder="e.g. 4.2" /></div>
        </div>
        <button type="submit" class="btn btn--white-rose btn--block"><app-icon name="plus" size="sm" /> Add influencer</button>
      </form>
    }
  `,
})
export class InfluencersSection {
  protected readonly store = inject(ManagementStore);
  private readonly toasts = inject(Toasts);
  protected readonly tone = statusTone;
  protected readonly platform = platformTone;
  protected readonly filters = [
    { id: 'all' as const, label: 'All' },
    { id: 'active' as const, label: 'Active' },
    { id: 'pending' as const, label: 'Pending' },
    { id: 'inactive' as const, label: 'Inactive' },
  ];

  protected onSearch(event: Event): void {
    this.store.influencerQuery.set((event.target as HTMLInputElement).value);
  }

  protected submit(event: Event): void {
    event.preventDefault();
    this.store.addInfluencer(event.target as HTMLFormElement);
  }

  protected profile(name: string): void {
    this.toasts.show('View Profile', `This would open ${name}'s detailed profile.`);
  }

  protected message(name: string): void {
    this.toasts.show('Message influencer', `This would start a conversation with ${name}.`);
  }
}
