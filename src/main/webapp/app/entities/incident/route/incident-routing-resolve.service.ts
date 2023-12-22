import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IIncident } from '../incident.model';
import { IncidentService } from '../service/incident.service';

export const incidentResolve = (route: ActivatedRouteSnapshot): Observable<null | IIncident> => {
  const id = route.params['id'];
  if (id) {
    return inject(IncidentService)
      .find(id)
      .pipe(
        mergeMap((incident: HttpResponse<IIncident>) => {
          if (incident.body) {
            return of(incident.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default incidentResolve;
