import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../state/auth.service';
import { CreatorStore } from '../../state/creator.store';
import { ManagementStore } from '../../state/management.store';
import { Icon } from '../../ui/icon';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, Icon],
  template: `
    <main class="auth-screen">
      <section class="auth-card" aria-labelledby="login-title">
        <div class="auth-brand">
          <span class="logo" aria-hidden="true"><app-icon name="sparkles" /></span>
          <span>
            <strong>CreatorFi</strong>
            <small>Management Suite</small>
          </span>
        </div>
        <h1 id="login-title">Sign in</h1>
        <p>Manager accounts open the workspace. Creator sign-in comes later.</p>
        <form (submit)="submit($event)">
          @if (error()) {
            <p class="form-error" role="alert">{{ error() }}</p>
          }
          <div class="field">
            <label for="login-email">Email</label>
            <input id="login-email" name="email" type="email" autocomplete="email" required />
          </div>
          <div class="field">
            <label for="login-password">Password</label>
            <input id="login-password" name="password" type="password" autocomplete="current-password" required />
          </div>
          <button type="submit" class="btn btn--block" [disabled]="busy()">
            {{ busy() ? 'Signing in…' : 'Sign in' }}
          </button>
        </form>
        <p class="auth-switch">New here? <a routerLink="/register">Create a manager account</a></p>
      </section>
    </main>
  `,
  styleUrl: './auth.scss',
})
export class LoginPage {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly management = inject(ManagementStore);
  private readonly creator = inject(CreatorStore);
  protected readonly error = signal('');
  protected readonly busy = signal(false);

  protected submit(event: Event): void {
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement);
    const email = String(data.get('email') ?? '').trim();
    const password = String(data.get('password') ?? '');
    if (!email || !password) {
      this.error.set('Email and password are required.');
      return;
    }
    this.busy.set(true);
    this.error.set('');
    this.auth.login(email, password).subscribe({
      next: () => {
        this.management.load();
        this.creator.load();
        void this.router.navigateByUrl('/');
      },
      error: (failure: HttpErrorResponse) => {
        this.busy.set(false);
        const body = failure.error as { message?: string } | null;
        this.error.set(body?.message || 'The API could not sign you in.');
      },
    });
  }
}
