import { Component, computed, ElementRef, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { initials } from './models/records';
import { ShellLayout } from './layout/shell-layout';
import { Auth } from './state/auth.service';
import { CreatorStore } from './state/creator.store';
import { ManagementStore } from './state/management.store';
import { Toasts } from './state/toast.service';
import { Icon } from './ui/icon';
import { ToastHost } from './ui/toast-host';

@Component({
  imports: [RouterOutlet, RouterLink, Icon, ToastHost],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
  host: {
    '(document:keydown.escape)': 'onEscape()',
  },
})
export class App {
  protected readonly layout = inject(ShellLayout);
  protected readonly management = inject(ManagementStore);
  protected readonly creator = inject(CreatorStore);
  protected readonly auth = inject(Auth);
  private readonly toasts = inject(Toasts);
  private readonly router = inject(Router);
  private readonly sidebarToggle = viewChild<ElementRef<HTMLButtonElement>>('sidebarToggle');

  private readonly path = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(window.location.pathname),
    ),
    { initialValue: window.location.pathname },
  );

  protected readonly isCreator = computed(() => this.path().startsWith('/creator'));
  protected readonly showShell = computed(() => this.auth.isManager() && !this.path().startsWith('/login') && !this.path().startsWith('/register'));
  protected readonly accountName = computed(() => {
    if (this.isCreator()) {
      return this.creator.profile().name || 'Your studio';
    }
    return this.auth.session()?.name || 'Workspace';
  });
  protected readonly accountInitials = computed(() => {
    if (this.isCreator()) {
      const name = this.creator.profile().name;
      return name ? initials(name) : 'CF';
    }
    const name = this.auth.session()?.name;
    return name ? initials(name) : 'WS';
  });
  protected readonly accountPlan = computed(() =>
    this.isCreator() ? this.creator.profile().plan : this.management.currentPlan(),
  );

  protected toggleSidebar(): void {
    const openingOverlay = this.layout.presentation() === 'overlay' && !this.layout.sidebarOpen();
    this.layout.toggle();
    if (openingOverlay) {
      setTimeout(() => document.querySelector<HTMLElement>('#app-sidebar nav button')?.focus());
    }
  }

  protected closeOverlay(): void {
    this.layout.closeOverlay();
    this.sidebarToggle()?.nativeElement.focus();
  }

  protected onEscape(): void {
    if (this.layout.presentation() === 'overlay' && this.layout.sidebarOpen()) {
      this.closeOverlay();
    }
  }

  protected onSidebarSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (this.isCreator()) {
      this.creator.sidebarQuery.set(value);
      return;
    }
    this.management.sidebarQuery.set(value);
  }

  protected openManagement(section: Parameters<ManagementStore['openSection']>[0]): void {
    this.management.openSection(section);
    if (this.layout.presentation() === 'overlay') {
      this.closeOverlay();
    }
  }

  protected notify(kind: 'messages' | 'notifications'): void {
    if (kind === 'messages') {
      this.toasts.show('Messages', 'Messaging is not connected yet, but this is where your inbox will appear.');
      return;
    }
    const count = this.isCreator() ? 0 : this.management.activity().length;
    this.toasts.show('Notifications', count ? `${count} recent workspace events are on the overview.` : "You're all caught up.");
  }

  protected signOut(): void {
    this.auth.signOut();
    void this.router.navigateByUrl('/login');
  }

  protected settings(): void {
    this.toasts.show('Settings', 'Settings navigation is not wired to a separate page yet.');
  }

  protected account(): void {
    if (this.isCreator()) {
      this.creator.section.set('account');
      return;
    }
    this.toasts.show('Account', 'Account management will live here in a full implementation.');
  }
}
