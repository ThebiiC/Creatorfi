import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ManagementStore } from '../../state/management.store';
import { ApplicationsSection } from './applications-section';
import { BrandsSection } from './brands-section';
import { CampaignsSection } from './campaigns-section';
import { CoachingSection } from './coaching-section';
import { InfluencersSection } from './influencers-section';
import { OverviewSection } from './overview-section';
import { PlansSection } from './plans-section';
import { VettingSection } from './vetting-section';

@Component({
  selector: 'app-management-page',
  imports: [
    OverviewSection,
    InfluencersSection,
    BrandsSection,
    CampaignsSection,
    CoachingSection,
    VettingSection,
    ApplicationsSection,
    PlansSection,
  ],
  template: `
    <div class="stack">
      <div class="tabs" role="tablist" aria-label="Management sections">
        @for (tab of tabs; track tab.id) {
          <button
            type="button"
            role="tab"
            [attr.aria-selected]="store.section() === tab.id"
            [class.is-selected]="store.section() === tab.id"
            (click)="store.openSection(tab.id)"
          >
            {{ tab.label }}
            @if (tab.id === 'applications' && store.pendingCount() > 0) {
              <span class="badge badge--count">{{ store.pendingCount() }}</span>
            }
          </button>
        }
      </div>

      @switch (store.section()) {
        @case ('overview') { <app-overview-section /> }
        @case ('influencers') { <app-influencers-section /> }
        @case ('brands') { <app-brands-section /> }
        @case ('campaigns') { <app-campaigns-section /> }
        @case ('coaching') { <app-coaching-section /> }
        @case ('vetting') { <app-vetting-section /> }
        @case ('applications') { <app-applications-section /> }
        @case ('plans') { <app-plans-section /> }
      }
    </div>
  `,
})
export class ManagementPage {
  protected readonly store = inject(ManagementStore);
  protected readonly tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'influencers' as const, label: 'Influencers' },
    { id: 'brands' as const, label: 'Brands' },
    { id: 'campaigns' as const, label: 'Campaigns' },
    { id: 'coaching' as const, label: 'Coaching' },
    { id: 'vetting' as const, label: 'Vetting' },
    { id: 'applications' as const, label: 'Applications' },
    { id: 'plans' as const, label: 'Plans' },
  ];

  constructor() {
    inject(Title).setTitle('CreatorFi - Influencer & Brand Management Dashboard');
  }
}
