import { Component, inject } from '@angular/core';
import { ManagementStore } from '../../state/management.store';
import { HeroBanner } from '../../ui/hero-banner';
import { Icon } from '../../ui/icon';

@Component({
  selector: 'app-plans-section',
  imports: [HeroBanner, Icon],
  template: `
    <div class="stack">
      <app-hero-banner
        tone="amber"
        title="Subscription Plans"
        subtitle="Choose the perfect plan for your influencer management needs. Upgrade or downgrade anytime."
      >
        <div heroAside class="id-card">
          <span class="cluster"><app-icon name="crown" size="sm" /> Current Plan: {{ store.currentPlan() }}</span>
        </div>
      </app-hero-banner>

      <section class="card-grid">
        @for (plan of store.plans(); track plan.name) {
          <article class="card" [class.card--lift]="plan.highlighted" style="display: flex; flex-direction: column">
            <div class="card__head">
              <div class="spread">
                <h3>{{ plan.name }}</h3>
                @if (plan.badge) {
                  <span class="badge" [class.badge--solid]="plan.highlighted">{{ plan.badge }}</span>
                }
              </div>
              <p class="price">{{ plan.price }}<span>{{ plan.period }}</span></p>
              <p class="muted">{{ plan.description }}</p>
            </div>
            <div class="card__body grow">
              <ul class="plan-list">
                @for (feature of plan.features; track feature) {
                  <li>
                    <app-icon name="check" size="sm" [class]="plan.highlighted ? 'violet' : 'good'" />
                    <span>{{ feature }}</span>
                  </li>
                }
              </ul>
            </div>
            <div class="card__foot">
              <button type="button" class="btn btn--block" [class.btn--outline]="store.currentPlan() !== plan.name" [class.btn--violet]="store.currentPlan() === plan.name" (click)="store.choosePlan(plan.name)">
                {{ store.currentPlan() === plan.name ? 'Current plan' : plan.cta }}
              </button>
            </div>
          </article>
        }
      </section>

      <section id="plan-distribution" class="stack-tight" aria-labelledby="distribution-title">
        <h2 id="distribution-title" class="block-title">Plan Distribution</h2>
        <div class="grid-4">
          @for (item of store.planDistribution(); track item.plan) {
            <article class="card card--pad">
              <div class="spread">
                <h3>{{ item.plan }}</h3>
                <strong style="font-size: 1.5rem">{{ item.count }}</strong>
              </div>
              <div class="progress" [class]="'progress progress--' + item.color" role="progressbar" [attr.aria-valuenow]="item.pct" aria-valuemin="0" aria-valuemax="100" [attr.aria-label]="item.plan + ' share'">
                <span [style.width.%]="item.pct"></span>
              </div>
              <p class="muted">{{ item.pct }}% of total influencers</p>
            </article>
          }
        </div>
      </section>
    </div>
  `,
})
export class PlansSection {
  protected readonly store = inject(ManagementStore);
}
