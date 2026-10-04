import { Component, input } from '@angular/core';

@Component({
  selector: 'app-hero-banner',
  template: `
    <section class="hero" [attr.data-tone]="tone()">
      <div class="hero__copy">
        <ng-content select="[heroEyebrow]" />
        <h2>{{ title() }}</h2>
        <p>{{ subtitle() }}</p>
        <div class="hero__actions">
          <ng-content select="[heroActions]" />
        </div>
      </div>
      <ng-content select="[heroAside]" />
    </section>
  `,
})
export class HeroBanner {
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly tone = input('violet');
}
