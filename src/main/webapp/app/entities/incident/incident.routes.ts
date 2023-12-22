import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { IncidentComponent } from './list/incident.component';
import { IncidentDetailComponent } from './detail/incident-detail.component';
import { IncidentUpdateComponent } from './update/incident-update.component';
import IncidentResolve from './route/incident-routing-resolve.service';

const incidentRoute: Routes = [
  {
    path: '',
    component: IncidentComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: IncidentDetailComponent,
    resolve: {
      incident: IncidentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: IncidentUpdateComponent,
    resolve: {
      incident: IncidentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: IncidentUpdateComponent,
    resolve: {
      incident: IncidentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default incidentRoute;
