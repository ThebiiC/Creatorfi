import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Toasts } from './state/toast.service';

export interface Mutation<T> {
  snapshot: T;
  toastTitle: string | null;
  toastMessage: string | null;
}

@Service()
export class Api {
  private readonly http = inject(HttpClient);

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(path);
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(path, body);
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(path, body);
  }

  patch<T>(path: string, body: unknown): Observable<T> {
    return this.http.patch<T>(path, body);
  }
}

export function showApiError(error: HttpErrorResponse, toasts: Toasts): void {
  const body = error.error as { title?: string; message?: string } | null;
  const title = body && typeof body === 'object' && body.title ? body.title : 'Request failed';
  const message = body && typeof body === 'object' && body.message ? body.message : 'Start CreatorFi.Api, then try again.';
  toasts.show(title, message);
}
