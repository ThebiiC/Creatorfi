import { computed, inject, signal, Service } from '@angular/core';
import { tap } from 'rxjs';
import { Api } from '../api';

const STORAGE_KEY = 'creatorfi.manager';

export interface ManagerSession {
  token: string;
  name: string;
  email: string;
  role: string;
}

function readSession(): ManagerSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<ManagerSession>;
    if (!parsed.token || parsed.role !== 'Manager') {
      return null;
    }
    return {
      token: parsed.token,
      name: parsed.name ?? '',
      email: parsed.email ?? '',
      role: parsed.role,
    };
  } catch {
    return null;
  }
}

@Service()
export class Auth {
  private readonly api = inject(Api);
  private readonly sessionState = signal<ManagerSession | null>(readSession());

  readonly session = this.sessionState.asReadonly();
  readonly isManager = computed(() => this.sessionState()?.role === 'Manager');

  token(): string | null {
    return this.sessionState()?.token ?? null;
  }

  register(name: string, email: string, password: string) {
    return this.api.post<ManagerSession>('/api/auth/register', { name, email, password }).pipe(tap((session) => this.remember(session)));
  }

  login(email: string, password: string) {
    return this.api.post<ManagerSession>('/api/auth/login', { email, password }).pipe(tap((session) => this.remember(session)));
  }

  signOut(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.sessionState.set(null);
  }

  private remember(session: ManagerSession): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    this.sessionState.set(session);
  }
}
