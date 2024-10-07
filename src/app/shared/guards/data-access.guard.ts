import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';

export const dataAccessGuard: CanActivateFn = (route, state) => {
  const studentId = route.paramMap.get('id');
  const trainingId = route.paramMap.get('trId');
  
  const userService = inject(UserService);
  const router = inject(Router);

  const user = userService.currentUser;
  if (!user) return false;
  
  if (studentId && !user.studentsId.find(allowedStudentId => allowedStudentId === studentId))
    return router.createUrlTree(["/students"]);
  
  if (trainingId && trainingId != "new" && !user.trainingsId.find(allowedTrainingId => allowedTrainingId === trainingId))
    return router.createUrlTree(["/students"]);

  return true;
};
