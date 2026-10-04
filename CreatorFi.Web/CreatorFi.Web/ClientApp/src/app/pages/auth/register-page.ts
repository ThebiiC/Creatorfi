import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../state/auth.service';
import { CreatorStore } from '../../state/creator.store';
import { ManagementStore } from '../../state/management.store';
import { Icon } from '../../ui/icon';

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, Icon],
  template: `
    <main class="auth-screen">
      <section class="auth-card" aria-labelledby="register-title">
        <div class="auth-brand">
          <span class="logo" aria-hidden="true"><app-icon name="sparkles" /></span>
          <span>
            <strong>CreatorFi</strong>
            <small>Management Suite</small>
          </span>
        </div>
        <h1 id="register-title">Create a manager account</h1>
        <p>This account can run the roster, brands, campaigns, and vetting. Creator accounts come later.</p>
        <form (submit)="submit($event)">
          @if (error()) {
            <p class="form-error" role="alert">{{ error() }}</p>
          }
          <div class="field">
            <label for="register-name">Name</label>
            <input id="register-name" name="name" autocomplete="name" required />
          </div>
          <div class="field">
            <label for="register-email">Email</label>
            <input id="register-email" name="email" type="email" autocomplete="email" required />
          </div>
          <div class="field">
            <label for="register-password">Password</label>
            <input id="register-password" name="password" type="password" autocomplete="new-password" minlength="8" required />
          </div>
          <div class="field">
            <label for="register-confirm">Confirm password</label>
            <input id="register-confirm" name="confirm" type="password" autocomplete="new-password" minlength="8" required />
          </div>
          <button type="submit" class="btn btn--block" [disabled]="busy()">
            {{ busy() ? 'Creating account…' : 'Create account' }}
          </button>
        </form>
        <p class="auth-switch">Already registered? <a routerLink="/login">Sign in</a></p>
      </section>
    </main>
  `,
  styleUrl: './auth.scss',
})
export class RegisterPage {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly management = inject(ManagementStore);
  private readonly creator = inject(CreatorStore);
  protected readonly error = signal('');
  protected readonly busy = signal(false);

  protected submit(event: Event): void {
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const password = String(data.get('password') ?? '');
    const confirm = String(data.get('confirm') ?? '');
    if (!name || !email || !password) {
      this.error.set('Name, email, and password are required.');
      return;
    }
    if (password.length < 8) {
      this.error.set('Use at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      this.error.set('Those passwords do not match.');
      return;
    }
    this.busy.set(true);
    this.error.set('');
    this.auth.register(name, email, password).subscribe({
      next: () => {
        this.management.load();
        this.creator.load();
        void this.router.navigateByUrl('/');
      },
      error: (failure: HttpErrorResponse) => {
        this.busy.set(false);
        const body = failure.error as { message?: string } | null;
        this.error.set(body?.message || 'The API could not create that account.');
      },
    });
  }
}
