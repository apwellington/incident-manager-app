import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IDepartment } from 'app/entities/department/department.model';
import { DepartmentService } from 'app/entities/department/service/department.service';
import { IPriority } from 'app/entities/priority/priority.model';
import { PriorityService } from 'app/entities/priority/service/priority.service';
import { IStatus } from 'app/entities/status/status.model';
import { StatusService } from 'app/entities/status/service/status.service';
import { IUserApp } from 'app/entities/user-app/user-app.model';
import { UserAppService } from 'app/entities/user-app/service/user-app.service';
import { IncidentService } from '../service/incident.service';
import { IIncident } from '../incident.model';
import { IncidentFormService, IncidentFormGroup } from './incident-form.service';

@Component({
  standalone: true,
  selector: 'jhi-incident-update',
  templateUrl: './incident-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class IncidentUpdateComponent implements OnInit {
  isSaving = false;
  incident: IIncident | null = null;

  usersSharedCollection: IUser[] = [];
  departmentsSharedCollection: IDepartment[] = [];
  prioritiesSharedCollection: IPriority[] = [];
  statusesSharedCollection: IStatus[] = [];
  userAppsSharedCollection: IUserApp[] = [];

  editForm: IncidentFormGroup = this.incidentFormService.createIncidentFormGroup();

  constructor(
    protected incidentService: IncidentService,
    protected incidentFormService: IncidentFormService,
    protected userService: UserService,
    protected departmentService: DepartmentService,
    protected priorityService: PriorityService,
    protected statusService: StatusService,
    protected userAppService: UserAppService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareDepartment = (o1: IDepartment | null, o2: IDepartment | null): boolean => this.departmentService.compareDepartment(o1, o2);

  comparePriority = (o1: IPriority | null, o2: IPriority | null): boolean => this.priorityService.comparePriority(o1, o2);

  compareStatus = (o1: IStatus | null, o2: IStatus | null): boolean => this.statusService.compareStatus(o1, o2);

  compareUserApp = (o1: IUserApp | null, o2: IUserApp | null): boolean => this.userAppService.compareUserApp(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ incident }) => {
      this.incident = incident;
      if (incident) {
        this.updateForm(incident);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const incident = this.incidentFormService.getIncident(this.editForm);
    if (incident.id !== null) {
      this.subscribeToSaveResponse(this.incidentService.update(incident));
    } else {
      this.subscribeToSaveResponse(this.incidentService.create(incident));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIncident>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(incident: IIncident): void {
    this.incident = incident;
    this.incidentFormService.resetForm(this.editForm, incident);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, incident.user);
    this.departmentsSharedCollection = this.departmentService.addDepartmentToCollectionIfMissing<IDepartment>(
      this.departmentsSharedCollection,
      incident.department,
    );
    this.prioritiesSharedCollection = this.priorityService.addPriorityToCollectionIfMissing<IPriority>(
      this.prioritiesSharedCollection,
      incident.priority,
    );
    this.statusesSharedCollection = this.statusService.addStatusToCollectionIfMissing<IStatus>(
      this.statusesSharedCollection,
      incident.status,
    );
    this.userAppsSharedCollection = this.userAppService.addUserAppToCollectionIfMissing<IUserApp>(
      this.userAppsSharedCollection,
      incident.userApp,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.incident?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.departmentService
      .query()
      .pipe(map((res: HttpResponse<IDepartment[]>) => res.body ?? []))
      .pipe(
        map((departments: IDepartment[]) =>
          this.departmentService.addDepartmentToCollectionIfMissing<IDepartment>(departments, this.incident?.department),
        ),
      )
      .subscribe((departments: IDepartment[]) => (this.departmentsSharedCollection = departments));

    this.priorityService
      .query()
      .pipe(map((res: HttpResponse<IPriority[]>) => res.body ?? []))
      .pipe(
        map((priorities: IPriority[]) =>
          this.priorityService.addPriorityToCollectionIfMissing<IPriority>(priorities, this.incident?.priority),
        ),
      )
      .subscribe((priorities: IPriority[]) => (this.prioritiesSharedCollection = priorities));

    this.statusService
      .query()
      .pipe(map((res: HttpResponse<IStatus[]>) => res.body ?? []))
      .pipe(map((statuses: IStatus[]) => this.statusService.addStatusToCollectionIfMissing<IStatus>(statuses, this.incident?.status)))
      .subscribe((statuses: IStatus[]) => (this.statusesSharedCollection = statuses));

    this.userAppService
      .query()
      .pipe(map((res: HttpResponse<IUserApp[]>) => res.body ?? []))
      .pipe(map((userApps: IUserApp[]) => this.userAppService.addUserAppToCollectionIfMissing<IUserApp>(userApps, this.incident?.userApp)))
      .subscribe((userApps: IUserApp[]) => (this.userAppsSharedCollection = userApps));
  }
}
