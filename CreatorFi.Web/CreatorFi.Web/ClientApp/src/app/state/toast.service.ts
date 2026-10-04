import { DestroyRef, inject, signal, Service } from '@angular/core';

export interface ToastMessage {
  title: string;
  description: string;
}

@Service()
export class Toasts {
  private readonly destroyRef = inject(DestroyRef);
  private timer = 0;

  readonly current = signal<ToastMessage | null>(null);

  constructor() {
    this.destroyRef.onDestroy(() => window.clearTimeout(this.timer));
  }

  show(title: string, description: string): void {
    this.current.set({ title, description });
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => this.current.set(null), 4200);
  }

  dismiss(): void {
    window.clearTimeout(this.timer);
    this.current.set(null);
  }
}
