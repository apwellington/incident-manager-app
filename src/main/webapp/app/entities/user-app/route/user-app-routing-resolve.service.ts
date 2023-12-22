import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserApp } from '../user-app.model';
import { UserAppService } from '../service/user-app.service';

export const userAppResolve = (route: ActivatedRouteSnapshot): Observable<null | IUserApp> => {
  const id = route.params['id'];
  if (id) {
    return inject(UserAppService)
      .find(id)
      .pipe(
        mergeMap((userApp: HttpResponse<IUserApp>) => {
          if (userApp.body) {
            return of(userApp.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default userAppResolve;
