import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const isPublicPage = ['/login', '/register'].indexOf(state.url) != -1;

  const authenticationState = userService.validateAuth();

  let authenticated = true;

  if (!authenticationState) { // Not authenticated
    if (isPublicPage) {
      return true;
    }
    return router.createUrlTree(['/login']);
  }

  return authenticationState.pipe(
    map(() => {
      if (isPublicPage)
        return router.createUrlTree(['/home']);
      return true;
    }),
    catchError(() => {
      if (isPublicPage)
        return of(true);
      return of(router.createUrlTree(['/login']));
    })
  )
};
