import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { catchError, map, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export const authGuard: CanActivateFn = (route, state) => {
  const publicPages = ['/login', '/register'];
  const defaultPublic = ['/login'];
  const defaultPrivate = ['/home'];

  const userService = inject(UserService);
  const router = inject(Router);

  const isPublicPage = publicPages.indexOf(state.url) != -1;

  const authenticationState = userService.validateAuth();

  if (!authenticationState) {
    userService.lastSuccessVerifyTimestamp = 0; // Not authenticated
    if (isPublicPage) return true;

    console.warn(`Access to ${state.url} was blocked because user is not authenticated. 
        Redirecting to ${defaultPublic}...`);
    return router.createUrlTree(defaultPublic);
  }
  
  // * Prevents extremely overused Service/API call
  // * Calls only when last successful api call has been longer than 5 minutes ago
  if (userService.currentUser && Date.now() - userService.lastSuccessVerifyTimestamp < 300000) {
    if (isPublicPage) {
      console.warn(`Access to ${state.url} was blocked because user is already authenticated. 
    Redirecting to ${defaultPrivate}...`);
      return router.createUrlTree(defaultPrivate);
    }
    return true;
  }

  return authenticationState.pipe(
    map(() => {
      userService.lastSuccessVerifyTimestamp = Date.now();
      
      if (isPublicPage) {
        console.warn(`Access to ${state.url} was blocked because user is already authenticated. 
        Redirecting to ${defaultPrivate}...`);
        return router.createUrlTree(defaultPrivate);
      }
      return true;
    }),
    catchError((error: HttpErrorResponse | Error) => {
      userService.lastSuccessVerifyTimestamp = 0;

      if (error instanceof HttpErrorResponse && error.status === 404) // Not found
        localStorage.removeItem('authToken');

      if (isPublicPage)
        return of(true);

      console.error(error);
      console.warn(`Access to ${state.url} was blocked because token expired or server responded with an error. 
        Redirecting to ${defaultPublic}...`);
      return of(router.createUrlTree(defaultPublic));
    })
  )
};
