import { Component, inject } from '@angular/core';
import { statusTone } from '../../models/records';
import { ManagementStore } from '../../state/management.store';
import { Toasts } from '../../state/toast.service';
import { HeroBanner } from '../../ui/hero-banner';
import { Icon } from '../../ui/icon';

@Component({
  selector: 'app-brands-section',
  imports: [HeroBanner, Icon],
  template: `
    <div class="stack">
      <app-hero-banner
        tone="teal"
        title="Brand Partners"
        subtitle="Manage your brand partnerships, track budgets, and build lasting relationships."
      >
        <div heroActions>
          <button type="button" class="btn btn--white-teal" (click)="store.brandFormOpen.set(true)">
            <app-icon name="plus" size="sm" /> Add Brand
          </button>
        </div>
      </app-hero-banner>

      <div class="filters">
        @for (filter of filters; track filter.id) {
          <button type="button" class="btn btn--outline" [class.is-selected]="store.brandFilter() === filter.id" (click)="store.brandFilter.set(filter.id)">
            {{ filter.label }}
          </button>
        }
        <label class="search">
          <app-icon name="search" size="sm" />
          <span class="sr-only">Search brands</span>
          <input type="search" placeholder="Search brands..." [value]="store.brandQuery()" (input)="onSearch($event)" />
        </label>
      </div>

      <section class="grid-3">
        @for (brand of store.visibleBrands(); track brand.name) {
          <article class="card card--hover">
            <div class="card__head">
              <div class="spread">
                <div class="who">
                  <span class="logo-tile">{{ brand.logo }}</span>
                  <div>
                    <h3>{{ brand.name }}</h3>
                    <p class="muted">{{ brand.industry }}</p>
                  </div>
                </div>
                <span class="badge" [class]="'badge badge--' + tone(brand.status)">{{ brand.status }}</span>
              </div>
            </div>
            <div class="card__body">
              <div class="grid-3">
                <div class="metric"><span>Budget</span><strong>{{ brand.budget }}</strong></div>
                <div class="metric"><span>Campaigns</span><strong>{{ brand.campaigns }}</strong></div>
                <div class="metric"><span>Influencers</span><strong>{{ brand.influencers }}</strong></div>
              </div>
              <div class="spread">
                <span class="cluster warn"><app-icon name="star" size="sm" />{{ brand.rating }}</span>
                <button type="button" class="btn btn--ghost btn--sm" (click)="details(brand.name)">
                  <app-icon name="eye" size="sm" /> Details
                </button>
              </div>
            </div>
          </article>
        } @empty {
          <p class="muted">No brands match that filter.</p>
        }
      </section>
    </div>

    @if (store.brandFormOpen()) {
      <button type="button" class="drawer-backdrop" aria-label="Close brand form" (click)="store.brandFormOpen.set(false)"></button>
      <form class="drawer" (submit)="submit($event)" aria-labelledby="brand-form-title">
        <h2 id="brand-form-title">Add brand manually</h2>
        <div class="field"><label for="brand-name">Brand name</label><input id="brand-name" name="name" required placeholder="e.g. Nova Cosmetics" /></div>
        <div class="field"><label for="industry">Industry</label><input id="industry" name="industry" placeholder="e.g. Beauty & Cosmetics" /></div>
        <div class="form-grid">
          <div class="field"><label for="budget">Budget</label><input id="budget" name="budget" placeholder="R25,000" /></div>
          <div class="field"><label for="brand-influencers">Influencers</label><input id="brand-influencers" name="influencers" type="number" min="0" placeholder="e.g. 3" /></div>
        </div>
        <button type="submit" class="btn btn--white-teal btn--block"><app-icon name="plus" size="sm" /> Add brand</button>
      </form>
    }
  `,
})
export class BrandsSection {
  protected readonly store = inject(ManagementStore);
  private readonly toasts = inject(Toasts);
  protected readonly tone = statusTone;
  protected readonly filters = [
    { id: 'all' as const, label: 'All Brands' },
    { id: 'active' as const, label: 'Active' },
    { id: 'paused' as const, label: 'Paused' },
  ];

  protected onSearch(event: Event): void {
    this.store.brandQuery.set((event.target as HTMLInputElement).value);
  }

  protected submit(event: Event): void {
    event.preventDefault();
    this.store.addBrand(event.target as HTMLFormElement);
  }

  protected details(name: string): void {
    this.toasts.show('Brand details', `This would open more information about ${name}.`);
  }
}
