import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'user-app',
    data: { pageTitle: 'incidentManagerApp.userApp.home.title' },
    loadChildren: () => import('./user-app/user-app.routes'),
  },
  {
    path: 'department',
    data: { pageTitle: 'incidentManagerApp.department.home.title' },
    loadChildren: () => import('./department/department.routes'),
  },
  {
    path: 'priority',
    data: { pageTitle: 'incidentManagerApp.priority.home.title' },
    loadChildren: () => import('./priority/priority.routes'),
  },
  {
    path: 'status',
    data: { pageTitle: 'incidentManagerApp.status.home.title' },
    loadChildren: () => import('./status/status.routes'),
  },
  {
    path: 'incident',
    data: { pageTitle: 'incidentManagerApp.incident.home.title' },
    loadChildren: () => import('./incident/incident.routes'),
  },
  {
    path: 'comment',
    data: { pageTitle: 'incidentManagerApp.comment.home.title' },
    loadChildren: () => import('./comment/comment.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
