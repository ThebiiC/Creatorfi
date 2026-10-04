import { Component, computed, inject } from '@angular/core';
import { platformTone } from '../../models/records';
import { ManagementStore } from '../../state/management.store';
import { HeroBanner } from '../../ui/hero-banner';
import { Icon } from '../../ui/icon';

@Component({
  selector: 'app-applications-section',
  imports: [HeroBanner, Icon],
  template: `
    <div class="stack">
      <app-hero-banner
        tone="fuchsia"
        title="Influencer Applications"
        subtitle="Review and manage applications from influencers who applied through your external website. Accept or decline requests to grow your roster."
      >
        <span heroEyebrow class="badge badge--glass"><app-icon name="clipboard" size="sm" /> External Applications</span>
        <div heroActions>
          <button type="button" class="btn btn--white" (click)="store.applicationFormOpen.set(true)">
            <app-icon name="plus" size="sm" /> Add application
          </button>
        </div>
        <div heroAside class="id-card">
          <span class="cluster"><app-icon name="clock" size="sm" /> {{ store.pendingCount() }} Pending</span>
        </div>
      </app-hero-banner>

      <section class="grid-4" aria-label="Application totals">
        @for (stat of summary(); track stat.label) {
          <article class="card card--pad">
            <div class="who">
              <span class="stat__icon" [class]="stat.tone"><app-icon [name]="stat.icon" /></span>
              <div>
                <strong style="font-size: 1.5rem">{{ stat.value }}</strong>
                <p class="muted">{{ stat.label }}</p>
              </div>
            </div>
          </article>
        }
      </section>

      <section class="stack-tight" aria-labelledby="pending-apps">
        <h2 id="pending-apps" class="block-title">Pending Applications</h2>
        @if (pending().length === 0) {
          <div class="card empty">
            <app-icon name="check" />
            <h3>All caught up</h3>
            <p class="muted">No pending applications to review.</p>
          </div>
        } @else {
          <div class="stack-tight">
            @for (item of pending(); track item.id) {
              <article class="card card--pad">
                <div class="spread" style="align-items: flex-start">
                  <div class="who" style="align-items: flex-start">
                    <span class="avatar avatar--lg">{{ item.avatar }}</span>
                    <div class="stack-tight">
                      <div>
                        <div class="cluster">
                          <h3>{{ item.name }}</h3>
                          <span class="badge">{{ item.handle }}</span>
                        </div>
                        <p class="muted cluster">
                          <span class="cluster"><app-icon name="mail" size="sm" /> {{ item.email }}</span>
                          <span class="cluster"><app-icon name="link" size="sm" /> {{ item.portfolio }}</span>
                        </p>
                      </div>
                      <div class="cluster">
                        <span class="badge"><span [class]="platform(item.platform)">{{ item.platform }}</span></span>
                        <span class="badge">{{ item.niche }}</span>
                        <span class="badge">{{ item.followers }} followers</span>
                        <span class="badge badge--good">{{ item.engagement }}% engagement</span>
                      </div>
                      <div class="note">
                        <span class="muted">Application Message</span>
                        <p>{{ item.message }}</p>
                      </div>
                      <div class="cluster">
                        <span class="muted">Applied on {{ item.appliedDate }}</span>
                        @if (item.idDocumentUrl) {
                          <a class="btn btn--outline btn--sm" [href]="item.idDocumentUrl" target="_blank" rel="noreferrer">
                            <app-icon name="file" size="sm" /> View ID document
                          </a>
                        }
                      </div>
                    </div>
                  </div>
                  <div class="stack-tight" style="min-width: 9rem">
                    <button type="button" class="btn btn--good" (click)="store.setApplicationStatus(item.id, 'accepted')">
                      <app-icon name="check" size="sm" /> Accept
                    </button>
                    <button type="button" class="btn btn--danger" (click)="store.setApplicationStatus(item.id, 'declined')">
                      <app-icon name="x" size="sm" /> Decline
                    </button>
                  </div>
                </div>
              </article>
            }
          </div>
        }
      </section>

      @if (accepted().length) {
        <section id="accepted" class="stack-tight" aria-labelledby="accepted-title">
          <h2 id="accepted-title" class="block-title">Accepted</h2>
          <div class="card panel">
            @for (item of accepted(); track item.id) {
              <div class="row">
                <div class="who">
                  <span class="avatar avatar--good">{{ item.avatar }}</span>
                  <div>
                    <p>{{ item.name }}</p>
                    <p class="muted">{{ item.handle }} - {{ item.platform }} - {{ item.followers }}</p>
                  </div>
                </div>
                <div class="cluster">
                  @if (item.idDocumentUrl) {
                    <a class="btn btn--outline btn--sm" [href]="item.idDocumentUrl" target="_blank" rel="noreferrer">
                      <app-icon name="file" size="sm" /> View ID
                    </a>
                  }
                  <span class="badge badge--good"><app-icon name="check" size="sm" /> Accepted</span>
                </div>
              </div>
            }
          </div>
        </section>
      }

      @if (declined().length) {
        <section id="declined" class="stack-tight" aria-labelledby="declined-title">
          <h2 id="declined-title" class="block-title">Declined</h2>
          <div class="card panel">
            @for (item of declined(); track item.id) {
              <div class="row">
                <div class="who">
                  <span class="avatar avatar--bad">{{ item.avatar }}</span>
                  <div>
                    <p>{{ item.name }}</p>
                    <p class="muted">{{ item.handle }} - {{ item.platform }} - {{ item.followers }}</p>
                  </div>
                </div>
                <div class="cluster">
                  @if (item.idDocumentUrl) {
                    <a class="btn btn--outline btn--sm" [href]="item.idDocumentUrl" target="_blank" rel="noreferrer">
                      <app-icon name="file" size="sm" /> View ID
                    </a>
                  }
                  <span class="badge badge--bad"><app-icon name="x" size="sm" /> Declined</span>
                </div>
              </div>
            }
          </div>
        </section>
      }
    </div>

    @if (store.applicationFormOpen()) {
      <button type="button" class="drawer-backdrop" aria-label="Close application form" (click)="store.applicationFormOpen.set(false)"></button>
      <form class="drawer" (submit)="submit($event)" aria-labelledby="application-title">
        <h2 id="application-title">Add an application</h2>
        <div class="field"><label for="app-name">Full name</label><input id="app-name" name="name" required /></div>
        <div class="field"><label for="app-handle">Handle</label><input id="app-handle" name="handle" required placeholder="@handle" /></div>
        <div class="field"><label for="app-email">Email</label><input id="app-email" name="email" type="email" required /></div>
        <div class="form-grid">
          <div class="field"><label for="app-platform">Platform</label><input id="app-platform" name="platform" placeholder="Instagram" /></div>
          <div class="field"><label for="app-niche">Niche</label><input id="app-niche" name="niche" /></div>
        </div>
        <div class="form-grid">
          <div class="field"><label for="app-followers">Followers</label><input id="app-followers" name="followers" /></div>
          <div class="field"><label for="app-engagement">Engagement %</label><input id="app-engagement" name="engagement" type="number" step="0.1" /></div>
        </div>
        <div class="field"><label for="app-portfolio">Portfolio</label><input id="app-portfolio" name="portfolio" /></div>
        <div class="field"><label for="app-message">Message</label><textarea id="app-message" name="message" rows="3"></textarea></div>
        <button type="submit" class="btn btn--block">Add application</button>
      </form>
    }
  `,
})
export class ApplicationsSection {
  protected readonly store = inject(ManagementStore);
  protected readonly platform = platformTone;
  protected readonly pending = computed(() => this.store.applications().filter((item) => item.status === 'pending'));
  protected readonly accepted = computed(() => this.store.applications().filter((item) => item.status === 'accepted'));
  protected readonly declined = computed(() => this.store.applications().filter((item) => item.status === 'declined'));
  protected submit(event: Event): void {
    event.preventDefault();
    this.store.addApplication(event.target as HTMLFormElement);
  }

  protected readonly summary = computed(() => [
    { label: 'Pending', value: String(this.pending().length), icon: 'clock', tone: 'stat__icon stat__icon--amber' },
    { label: 'Accepted', value: String(this.accepted().length), icon: 'check', tone: 'stat__icon stat__icon--good' },
    { label: 'Declined', value: String(this.declined().length), icon: 'x', tone: 'stat__icon stat__icon--bad' },
    { label: 'Total Received', value: String(this.store.applications().length), icon: 'mail', tone: 'stat__icon' },
  ]);
}
