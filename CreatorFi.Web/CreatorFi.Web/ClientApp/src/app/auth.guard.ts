import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './state/auth.service';

export const managerGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  if (auth.isManager()) {
    return true;
  }
  return inject(Router).createUrlTree(['/login']);
};

export const guestGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  if (auth.isManager()) {
    return inject(Router).createUrlTree(['/']);
  }
  return true;
};
