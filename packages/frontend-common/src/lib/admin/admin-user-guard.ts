import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '@martinferra/frontend-common/shared/services';

@Injectable()
export class OnlyAdminUsersGuard {
  constructor(private authService: AuthService) {}

  canActivate(): Observable<boolean> {
    return this.authService.getUser().pipe(map(user => !!user?.isAdmin));
  }
}
