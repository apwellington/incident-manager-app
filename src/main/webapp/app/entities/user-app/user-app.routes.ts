import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { UserAppComponent } from './list/user-app.component';
import { UserAppDetailComponent } from './detail/user-app-detail.component';
import { UserAppUpdateComponent } from './update/user-app-update.component';
import UserAppResolve from './route/user-app-routing-resolve.service';

const userAppRoute: Routes = [
  {
    path: '',
    component: UserAppComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserAppDetailComponent,
    resolve: {
      userApp: UserAppResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserAppUpdateComponent,
    resolve: {
      userApp: UserAppResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserAppUpdateComponent,
    resolve: {
      userApp: UserAppResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default userAppRoute;
