import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const publicPages = ['/login', '/register'];
  const defaultPublic = ['/login'];
  const defaultPrivate = ['/home'];

  const userService = inject(UserService);
  const router = inject(Router);

  const isPublicPage = publicPages.indexOf(state.url) != -1;

  const authenticationState = userService.validateAuth();

  let authenticated = true;

  if (!authenticationState) { // Not authenticated
    
    if (isPublicPage) {
      return true;
    }
    console.warn(`Access to ${state.url} was blocked because user is not authenticated. 
      Redirecting to ${defaultPublic}...`);
    return router.createUrlTree(defaultPublic);
  }

  return authenticationState.pipe(
    map(() => {
      if (isPublicPage) {
        console.warn(`Access to ${state.url} was blocked because user is already authenticated. 
      Redirecting to ${defaultPrivate}...`);
        return router.createUrlTree(defaultPrivate);
      }
      return true;
    }),
    catchError(() => {
      if (isPublicPage)
        return of(true);
      console.warn(`Access to ${state.url} was blocked because token expired or server responded with an error. 
        Redirecting to ${defaultPublic}...`);
      return of(router.createUrlTree(defaultPublic));
    })
  )
};
