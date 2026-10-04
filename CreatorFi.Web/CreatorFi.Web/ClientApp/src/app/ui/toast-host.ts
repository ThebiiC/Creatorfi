import { Component, inject } from '@angular/core';
import { Toasts } from '../state/toast.service';

@Component({
  selector: 'app-toast-host',
  template: `
    @if (toasts.current(); as toast) {
      <div class="toast" role="status" aria-live="polite">
        <div>
          <p class="toast__title">{{ toast.title }}</p>
          <p class="toast__body">{{ toast.description }}</p>
        </div>
        <button type="button" class="icon-btn" aria-label="Dismiss notification" (click)="toasts.dismiss()">
          <span aria-hidden="true">×</span>
        </button>
      </div>
    }
  `,
})
export class ToastHost {
  protected readonly toasts = inject(Toasts);
}
