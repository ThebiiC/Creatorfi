import { Component, inject } from '@angular/core';
import { statusTone } from '../../models/records';
import { ManagementStore } from '../../state/management.store';
import { Toasts } from '../../state/toast.service';
import { HeroBanner } from '../../ui/hero-banner';
import { Icon } from '../../ui/icon';

@Component({
  selector: 'app-overview-section',
  imports: [HeroBanner, Icon],
  template: `
    <div class="stack">
      <app-hero-banner
        tone="violet"
        title="Welcome to CreatorFi Management"
        subtitle="Manage your influencer roster, brand partnerships, coaching programs, and vet new talent all in one place."
      >
        <span heroEyebrow class="badge badge--glass">Dashboard</span>
        <div heroActions>
          <button type="button" class="btn btn--white" (click)="scrollToStats()">View Analytics</button>
          <button type="button" class="btn btn--ghost-light" (click)="tour()">Quick Tour</button>
        </div>
        <div heroAside class="rings" aria-hidden="true">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
      </app-hero-banner>

      <section id="overview-stats" class="grid-4" aria-label="Key metrics">
        @for (stat of store.stats(); track stat.label) {
          <article class="card card--pad stat">
            <div class="stat__top">
              <span class="stat__icon"><app-icon [name]="stat.icon" /></span>
            </div>
            <strong>{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
          </article>
        }
      </section>

      <div class="grid-2">
        <section class="stack-tight" aria-labelledby="top-influencers">
          <div class="section-head">
            <h2 id="top-influencers">Top Influencers</h2>
            <button type="button" class="btn btn--ghost" (click)="store.openSection('influencers')">View All</button>
          </div>
          <div class="card panel">
            @for (person of store.influencers().slice(0, 4); track person.handle) {
              <div class="row">
                <div class="who">
                  <span class="avatar">{{ person.avatar }}</span>
                  <div>
                    <p>{{ person.name }}</p>
                    <p class="muted">{{ person.followers }} followers</p>
                  </div>
                </div>
                <div class="cluster">
                  <span class="badge" [class]="'badge badge--' + tone(person.status)">{{ person.status }}</span>
                  <strong class="good">{{ person.engagement }}%</strong>
                </div>
              </div>
            } @empty {
              <div class="empty">
                <h3>No influencers yet</h3>
                <p class="muted">Onboard someone and they will show up here.</p>
              </div>
            }
          </div>
        </section>

        <section class="stack-tight" aria-labelledby="recent-activity">
          <div class="section-head">
            <h2 id="recent-activity">Recent Activity</h2>
            <button type="button" class="btn btn--ghost" (click)="activity()">View All</button>
          </div>
          <div class="card panel">
            @for (item of store.activity(); track item.text) {
              <div class="row">
                <span class="bubble" [class]="'bubble bubble--' + item.type">
                  <app-icon [name]="item.type === 'milestone' ? 'star' : item.type === 'brand' ? 'building' : 'target'" size="sm" />
                </span>
                <div class="grow">
                  <p>{{ item.text }}</p>
                  <p class="muted">{{ item.time }}</p>
                </div>
              </div>
            } @empty {
              <div class="empty">
                <h3>No activity yet</h3>
                <p class="muted">Onboarding, applications, and vetting decisions are logged here.</p>
              </div>
            }
          </div>
        </section>
      </div>

      <section class="stack-tight" aria-labelledby="active-campaigns">
        <div class="section-head">
          <h2 id="active-campaigns">Active Campaigns</h2>
          <button type="button" class="btn btn--ghost" (click)="store.openSection('campaigns')">View All</button>
        </div>
        <div class="grid-3">
          @for (campaign of store.liveCampaigns(); track campaign.name) {
            <article class="card card--hover">
              <div class="card__head">
                <div class="spread">
                  <span class="badge badge--good">{{ campaign.status }}</span>
                  <span class="muted">{{ campaign.brand }}</span>
                </div>
                <h3>{{ campaign.name }}</h3>
              </div>
              <div class="card__body">
                <div class="spread">
                  <span class="muted">Progress</span>
                  <span>{{ campaign.progress }}%</span>
                </div>
                <div class="progress" role="progressbar" [attr.aria-valuenow]="campaign.progress" aria-valuemin="0" aria-valuemax="100">
                  <span [style.width.%]="campaign.progress"></span>
                </div>
                <div class="spread muted">
                  <span class="cluster"><app-icon name="users" size="sm" />{{ campaign.influencers }} influencers</span>
                  <span class="cluster"><app-icon name="eye" size="sm" />{{ campaign.reach }} reach</span>
                </div>
              </div>
              <div class="card__foot spread">
                <span class="muted">Spent: {{ campaign.spent }}</span>
                <strong>of {{ campaign.budget }}</strong>
              </div>
            </article>
          } @empty {
            <p class="muted">No live campaigns yet.</p>
          }
        </div>
      </section>
    </div>
  `,
})
export class OverviewSection {
  protected readonly store = inject(ManagementStore);
  private readonly toasts = inject(Toasts);
  protected readonly tone = statusTone;

  protected scrollToStats(): void {
    document.getElementById('overview-stats')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.toasts.show('Analytics', 'Scroll down to explore key metrics and stats on this dashboard.');
  }

  protected tour(): void {
    this.toasts.show('Interactive tour', 'A guided tour isn’t implemented yet, but all sections below are interactive.');
  }

  protected activity(): void {
    const count = this.store.activity().length;
    this.toasts.show('Activity', count ? `${count} events are listed on this page.` : 'Nothing has been logged yet.');
  }
}
