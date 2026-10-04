import { Component, inject } from '@angular/core';
import { statusTone } from '../../models/records';
import { ManagementStore } from '../../state/management.store';
import { Toasts } from '../../state/toast.service';
import { HeroBanner } from '../../ui/hero-banner';
import { Icon } from '../../ui/icon';

@Component({
  selector: 'app-campaigns-section',
  imports: [HeroBanner, Icon],
  template: `
    <div class="stack">
      <app-hero-banner
        tone="indigo"
        title="Campaign Manager"
        subtitle="Track campaign performance, manage budgets, and measure ROI across all partnerships."
      >
        <div heroActions>
          <button type="button" class="btn btn--white-indigo" (click)="store.campaignFormOpen.set(true)">
            <app-icon name="plus" size="sm" /> New Campaign
          </button>
        </div>
      </app-hero-banner>

      <div class="filters">
        @for (filter of filters; track filter.id) {
          <button type="button" class="btn btn--outline" [class.is-selected]="store.campaignFilter() === filter.id" (click)="store.campaignFilter.set(filter.id)">
            <app-icon [name]="filter.icon" size="sm" /> {{ filter.label }}
          </button>
        }
        <label class="search">
          <app-icon name="search" size="sm" />
          <span class="sr-only">Search campaigns</span>
          <input type="search" placeholder="Search campaigns..." [value]="store.campaignQuery()" (input)="onSearch($event)" />
        </label>
      </div>

      <section class="card panel">
        <div class="table-head">
          <span>Campaign</span><span>Brand</span><span>Budget</span><span>Progress</span><span>Reach</span><span>Timeline</span>
        </div>
        @for (campaign of store.visibleCampaigns(); track campaign.name) {
          <div class="table-row">
            <div class="who">
              <span class="stat__icon" [class]="iconTone(campaign.status)"><app-icon name="target" /></span>
              <div>
                <p>{{ campaign.name }}</p>
                <span class="badge" [class]="'badge badge--' + tone(campaign.status)">{{ campaign.status }}</span>
              </div>
            </div>
            <span>{{ campaign.brand }}</span>
            <div>
              <p>{{ campaign.spent }}</p>
              <p class="muted">of {{ campaign.budget }}</p>
            </div>
            <div class="cluster">
              <div class="progress grow" role="progressbar" [attr.aria-valuenow]="campaign.progress" aria-valuemin="0" aria-valuemax="100" [attr.aria-label]="campaign.name + ' progress'">
                <span [style.width.%]="campaign.progress"></span>
              </div>
              <span>{{ campaign.progress }}%</span>
            </div>
            <span>{{ campaign.reach }}</span>
            <div class="spread">
              <div>
                <p>{{ campaign.startDate }}</p>
                <p class="muted">to {{ campaign.endDate }}</p>
              </div>
              <button type="button" class="icon-btn" [attr.aria-label]="'Actions for ' + campaign.name" (click)="actions(campaign.name)">
                <app-icon name="settings" size="sm" />
              </button>
            </div>
          </div>
        } @empty {
          <p class="card--pad muted">No campaigns match that filter.</p>
        }
      </section>
    </div>

    @if (store.campaignFormOpen()) {
      <button type="button" class="drawer-backdrop" aria-label="Close campaign form" (click)="store.campaignFormOpen.set(false)"></button>
      <form class="drawer" (submit)="submit($event)" aria-labelledby="campaign-title">
        <h2 id="campaign-title">New campaign</h2>
        <div class="field"><label for="campaign-name">Campaign name</label><input id="campaign-name" name="name" required /></div>
        <div class="field">
          <label for="campaign-brand">Brand</label>
          <input id="campaign-brand" name="brand" required list="brand-names" />
          <datalist id="brand-names">
            @for (brand of store.brands(); track brand.name) {
              <option [value]="brand.name"></option>
            }
          </datalist>
        </div>
        <div class="field"><label for="campaign-budget">Budget</label><input id="campaign-budget" name="budget" placeholder="R0" /></div>
        <button type="submit" class="btn btn--white-indigo btn--block">Create draft</button>
      </form>
    }
  `,
})
export class CampaignsSection {
  protected readonly store = inject(ManagementStore);
  private readonly toasts = inject(Toasts);
  protected readonly tone = statusTone;
  protected readonly filters = [
    { id: 'all' as const, label: 'All', icon: 'clipboard' },
    { id: 'live' as const, label: 'Live', icon: 'target' },
    { id: 'draft' as const, label: 'Drafts', icon: 'file' },
    { id: 'completed' as const, label: 'Completed', icon: 'check' },
  ];

  protected onSearch(event: Event): void {
    this.store.campaignQuery.set((event.target as HTMLInputElement).value);
  }

  protected iconTone(status: string): string {
    if (status === 'live') return 'stat__icon stat__icon--good';
    if (status === 'completed') return 'stat__icon stat__icon--info';
    return 'stat__icon stat__icon--amber';
  }

  protected submit(event: Event): void {
    event.preventDefault();
    this.store.addCampaign(event.target as HTMLFormElement);
  }

  protected actions(name: string): void {
    this.toasts.show('Campaign actions', `Here you could pause, edit, or archive ${name}.`);
  }
}
