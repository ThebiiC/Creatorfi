import { Component, computed, inject } from '@angular/core';
import { ManagementStore } from '../../state/management.store';
import { HeroBanner } from '../../ui/hero-banner';
import { Icon } from '../../ui/icon';

@Component({
  selector: 'app-coaching-section',
  imports: [HeroBanner, Icon],
  template: `
    <div class="stack">
      <app-hero-banner
        tone="amber"
        title="Influencer Coaching"
        subtitle="Track coaching progress, manage sessions, and help influencers grow their skills and brand presence."
      >
        <span heroEyebrow class="badge badge--glass"><app-icon name="graduation" size="sm" /> Coaching Program</span>
        <div heroActions>
          <button type="button" class="btn btn--white-amber" (click)="store.assignOpen.set(true)">
            <app-icon name="plus" size="sm" /> Assign Coach
          </button>
        </div>
      </app-hero-banner>

      <section class="grid-4" aria-label="Coaching summary">
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

      <section class="stack-tight" aria-labelledby="in-progress">
        <h2 id="in-progress" class="block-title">In-Progress Coaching</h2>
        @if (inProgress().length === 0) {
          <div class="card empty">
            <h3>No coaching in progress</h3>
            <p class="muted">Assign a coach to someone on the roster.</p>
          </div>
        } @else {
        <div class="grid-2">
          @for (item of inProgress(); track item.handle) {
            <article class="card card--hover">
              <div class="card__head">
                <div class="spread">
                  <div class="who">
                    <span class="avatar avatar--lg avatar--warn">{{ item.avatar }}</span>
                    <div>
                      <h3>{{ item.name }}</h3>
                      <p class="muted">{{ item.handle }}</p>
                    </div>
                  </div>
                  <span class="badge badge--warn">{{ item.stage }}</span>
                </div>
              </div>
              <div class="card__body">
                <div class="spread">
                  <span class="muted">Coaching Progress</span>
                  <strong>{{ item.progress }}%</strong>
                </div>
                <div class="progress" role="progressbar" [attr.aria-valuenow]="item.progress" aria-valuemin="0" aria-valuemax="100">
                  <span [style.width.%]="item.progress"></span>
                </div>
                <div class="grid-2">
                  <div class="metric" style="text-align: left"><span>Coach</span><strong>{{ item.coach }}</strong></div>
                  <div class="metric" style="text-align: left"><span>Sessions</span><strong>{{ item.sessions }} completed</strong></div>
                </div>
                <div class="note">
                  <span class="muted">Notes</span>
                  <p>{{ item.notes }}</p>
                </div>
                <div class="spread">
                  <span class="muted cluster"><app-icon name="calendar" size="sm" /> Next: {{ item.nextSession }}</span>
                  <button type="button" class="btn btn--ghost btn--sm" (click)="store.completeCoaching(item.handle)">
                    <app-icon name="check" size="sm" /> Complete
                  </button>
                </div>
              </div>
            </article>
          }
        </div>
        }
      </section>

      <section id="coaching-completed" class="stack-tight" aria-labelledby="completed-coaching">
        <h2 id="completed-coaching" class="block-title">Completed Coaching</h2>
        <div class="card panel">
          @for (item of completed(); track item.handle) {
            <div class="row">
              <div class="who">
                <span class="avatar avatar--good">{{ item.avatar }}</span>
                <div>
                  <p>{{ item.name }}</p>
                  <p class="muted">{{ item.stage }}</p>
                </div>
              </div>
              <div class="cluster">
                <span class="muted">{{ item.sessions }} sessions with {{ item.coach }}</span>
                <span class="badge badge--good"><app-icon name="check" size="sm" /> Graduated</span>
              </div>
            </div>
          } @empty {
            <div class="empty">
              <h3>No graduates yet</h3>
              <p class="muted">Completed coaching shows up here.</p>
            </div>
          }
        </div>
      </section>
    </div>

    @if (store.assignOpen()) {
      <button type="button" class="drawer-backdrop" aria-label="Close assign coach form" (click)="store.assignOpen.set(false)"></button>
      <form class="drawer" (submit)="submit($event)" aria-labelledby="assign-title">
        <h2 id="assign-title">Assign a coach</h2>
        @if (store.influencers().length === 0) {
          <p class="muted">Onboard an influencer before assigning a coach.</p>
        } @else {
          <div class="field">
            <label for="coach-handle">Influencer</label>
            <select id="coach-handle" name="handle" required>
              @for (person of store.influencers(); track person.handle) {
                <option [value]="person.handle">{{ person.name }} ({{ person.handle }})</option>
              }
            </select>
          </div>
          <div class="field"><label for="coach-name">Coach</label><input id="coach-name" name="coach" required placeholder="Coach name" /></div>
          <div class="field"><label for="coach-stage">Stage</label><input id="coach-stage" name="stage" placeholder="Content strategy" /></div>
          <div class="field"><label for="coach-notes">Notes</label><input id="coach-notes" name="notes" placeholder="What should this coaching cover?" /></div>
          <button type="submit" class="btn btn--white-amber btn--block"><app-icon name="plus" size="sm" /> Assign coach</button>
        }
      </form>
    }
  `,
})
export class CoachingSection {
  protected readonly store = inject(ManagementStore);
  protected readonly inProgress = computed(() => this.store.coaching().filter((item) => item.status === 'in-progress'));
  protected readonly completed = computed(() => this.store.coaching().filter((item) => item.status === 'completed'));
  protected readonly summary = computed(() => {
    const items = this.store.coaching();
    const active = this.inProgress();
    const sessions = items.reduce((sum, item) => sum + item.sessions, 0);
    const average = active.length ? Math.round(active.reduce((sum, item) => sum + item.progress, 0) / active.length) : 0;
    return [
      { label: 'Active Coaching', value: String(active.length), icon: 'users', tone: 'stat__icon stat__icon--amber' },
      { label: 'Completed', value: String(this.completed().length), icon: 'check', tone: 'stat__icon stat__icon--good' },
      { label: 'Total Sessions', value: String(sessions), icon: 'calendar', tone: 'stat__icon stat__icon--info' },
      { label: 'Avg. Progress', value: `${average}%`, icon: 'trend', tone: 'stat__icon' },
    ];
  });

  protected submit(event: Event): void {
    event.preventDefault();
    this.store.assignCoach(event.target as HTMLFormElement);
  }
}
