import { Component, computed, inject } from '@angular/core';
import { platformTone } from '../../models/records';
import { ManagementStore } from '../../state/management.store';
import { Toasts } from '../../state/toast.service';
import { HeroBanner } from '../../ui/hero-banner';
import { Icon } from '../../ui/icon';

@Component({
  selector: 'app-vetting-section',
  imports: [HeroBanner, Icon],
  template: `
    <div class="stack">
      <app-hero-banner
        tone="sky"
        title="Influencer Vetting"
        subtitle="Verify influencer authenticity, review brand safety scores, and manage the vetting pipeline."
      >
        <span heroEyebrow class="badge badge--glass"><app-icon name="shield" size="sm" /> Verification</span>
        <div heroActions>
          <button type="button" class="btn btn--white-sky" (click)="start()">
            <app-icon name="shield" size="sm" /> Start Review
          </button>
        </div>
      </app-hero-banner>

      <section class="grid-4" aria-label="Vetting summary">
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

      <section id="pending-review" class="stack-tight" aria-labelledby="pending-review-title">
        <h2 id="pending-review-title" class="block-title">Pending Review</h2>
        @if (pending().length === 0) {
          <div class="card empty">
            <h3>No one is waiting</h3>
            <p class="muted">Onboard an influencer or accept an application to start a review.</p>
          </div>
        } @else {
        <div class="grid-2">
          @for (item of pending(); track item.handle) {
            <article class="card">
              <div class="card__head">
                <div class="spread">
                  <div class="who">
                    <span class="avatar avatar--lg avatar--warn">{{ item.avatar }}</span>
                    <div>
                      <h3>{{ item.name }}</h3>
                      <p class="muted">{{ item.handle }}</p>
                    </div>
                  </div>
                  <span class="badge badge--warn"><app-icon name="alert" size="sm" /> Needs Review</span>
                </div>
              </div>
              <div class="card__body">
                <div class="grid-3">
                  <div class="metric"><span>Followers</span><strong>{{ item.followers }}</strong></div>
                  <div class="metric"><span>Engagement</span><strong class="good">{{ item.engagement }}%</strong></div>
                  <div class="metric">
                    <span>Authenticity</span>
                    <strong [class]="item.authenticity >= 80 ? 'good' : item.authenticity >= 60 ? 'warn' : 'bad'">{{ item.authenticity }}%</strong>
                  </div>
                </div>
                <div class="spread">
                  <span [class]="platform(item.platform)">{{ item.platform }}</span>
                  <span class="cluster" [class]="item.brandSafe ? 'good' : 'bad'">
                    <app-icon [name]="item.brandSafe ? 'check' : 'x'" size="sm" />
                    Brand {{ item.brandSafe ? 'Safe' : 'Flagged' }}
                  </span>
                </div>
              </div>
              <div class="card__foot">
                <button type="button" class="btn btn--soft grow" (click)="store.reviewVetting(item.handle, true)"><app-icon name="shield" size="sm" /> Approve</button>
                <button type="button" class="btn btn--outline grow" (click)="store.reviewVetting(item.handle, false)"><app-icon name="x" size="sm" /> Reject</button>
              </div>
            </article>
          }
        </div>
        }
      </section>

      <section class="stack-tight" aria-labelledby="vetted-title">
        <h2 id="vetted-title" class="block-title">Vetted Influencers</h2>
        <div class="card panel table--vet">
          <div class="table-head">
            <span>Influencer</span><span>Platform</span><span>Authenticity</span><span>Brand Safe</span><span>Vetted By</span><span>Date</span>
          </div>
          @for (item of vetted(); track item.handle) {
            <div class="table-row">
              <div class="who">
                <span class="avatar avatar--good">{{ item.avatar }}</span>
                <div>
                  <p>{{ item.name }}</p>
                  <p class="muted">{{ item.followers }} followers</p>
                </div>
              </div>
              <span [class]="platform(item.platform)">{{ item.platform }}</span>
              <div class="cluster">
                <div class="progress grow" role="progressbar" [attr.aria-valuenow]="item.authenticity" aria-valuemin="0" aria-valuemax="100" [attr.aria-label]="item.name + ' authenticity'">
                  <span [style.width.%]="item.authenticity"></span>
                </div>
                <span>{{ item.authenticity }}%</span>
              </div>
              <span class="badge badge--good"><app-icon name="check" size="sm" /> Verified</span>
              <span>{{ item.vettedBy }}</span>
              <span class="muted">{{ item.vettedDate }}</span>
            </div>
          } @empty {
            <div class="empty">
              <h3>No vetted influencers</h3>
              <p class="muted">Approve a pending review and they will appear here.</p>
            </div>
          }
        </div>
      </section>
    </div>
  `,
})
export class VettingSection {
  protected readonly store = inject(ManagementStore);
  private readonly toasts = inject(Toasts);
  protected readonly platform = platformTone;
  protected readonly pending = computed(() => this.store.vetting().filter((item) => item.status === 'pending-review'));
  protected readonly vetted = computed(() => this.store.vetting().filter((item) => item.status === 'vetted'));
  protected readonly summary = computed(() => {
    const records = this.store.vetting();
    const safe = records.filter((item) => item.brandSafe).length;
    const average = records.length ? Math.round(records.reduce((sum, item) => sum + item.authenticity, 0) / records.length) : 0;
    return [
      { label: 'Vetted', value: String(this.vetted().length), icon: 'check', tone: 'stat__icon stat__icon--good' },
      { label: 'Pending Review', value: String(this.pending().length), icon: 'clock', tone: 'stat__icon stat__icon--amber' },
      { label: 'Avg. Authenticity', value: `${average}%`, icon: 'shield', tone: 'stat__icon stat__icon--sky' },
      { label: 'Brand Safe', value: `${safe}/${records.length}`, icon: 'star', tone: 'stat__icon stat__icon--pink' },
    ];
  });

  protected start(): void {
    document.getElementById('pending-review')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const waiting = this.pending().length;
    this.toasts.show('Start Review', waiting ? `${waiting} people are waiting below.` : 'The review queue is empty.');
  }
}
