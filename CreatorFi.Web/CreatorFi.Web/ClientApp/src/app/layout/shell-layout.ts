import { computed, DestroyRef, inject, signal, Service } from '@angular/core';

const COMPACT_MEDIA_QUERY = '(max-width: 767px)';

@Service()
export class ShellLayout {
  private readonly destroyRef = inject(DestroyRef);
  private readonly compact = signal(false);
  private readonly pinnedOpen = signal(true);
  private readonly overlayOpen = signal(false);

  readonly sidebarOpen = computed(() =>
    this.compact() ? this.overlayOpen() : this.pinnedOpen(),
  );

  readonly presentation = computed<'column' | 'overlay'>(() =>
    this.compact() ? 'overlay' : 'column',
  );

  constructor() {
    const query = window.matchMedia(COMPACT_MEDIA_QUERY);
    this.compact.set(query.matches);

    const onChange = (event: MediaQueryListEvent) => {
      this.compact.set(event.matches);
      if (event.matches) {
        this.overlayOpen.set(false);
      }
    };

    query.addEventListener('change', onChange);
    this.destroyRef.onDestroy(() => query.removeEventListener('change', onChange));
  }

  toggle(): void {
    if (this.compact()) {
      this.overlayOpen.update((open) => !open);
      return;
    }

    this.pinnedOpen.update((open) => !open);
  }

  closeOverlay(): void {
    this.overlayOpen.set(false);
  }
}
