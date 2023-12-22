import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

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
import { IIncident } from '../incident.model';
import { IncidentService } from '../service/incident.service';
import { IncidentFormService } from './incident-form.service';

import { IncidentUpdateComponent } from './incident-update.component';

describe('Incident Management Update Component', () => {
  let comp: IncidentUpdateComponent;
  let fixture: ComponentFixture<IncidentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let incidentFormService: IncidentFormService;
  let incidentService: IncidentService;
  let userService: UserService;
  let departmentService: DepartmentService;
  let priorityService: PriorityService;
  let statusService: StatusService;
  let userAppService: UserAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), IncidentUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(IncidentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IncidentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    incidentFormService = TestBed.inject(IncidentFormService);
    incidentService = TestBed.inject(IncidentService);
    userService = TestBed.inject(UserService);
    departmentService = TestBed.inject(DepartmentService);
    priorityService = TestBed.inject(PriorityService);
    statusService = TestBed.inject(StatusService);
    userAppService = TestBed.inject(UserAppService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const incident: IIncident = { id: 456 };
      const user: IUser = { id: 16136 };
      incident.user = user;

      const userCollection: IUser[] = [{ id: 5579 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ incident });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Department query and add missing value', () => {
      const incident: IIncident = { id: 456 };
      const department: IDepartment = { id: 2939 };
      incident.department = department;

      const departmentCollection: IDepartment[] = [{ id: 5017 }];
      jest.spyOn(departmentService, 'query').mockReturnValue(of(new HttpResponse({ body: departmentCollection })));
      const additionalDepartments = [department];
      const expectedCollection: IDepartment[] = [...additionalDepartments, ...departmentCollection];
      jest.spyOn(departmentService, 'addDepartmentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ incident });
      comp.ngOnInit();

      expect(departmentService.query).toHaveBeenCalled();
      expect(departmentService.addDepartmentToCollectionIfMissing).toHaveBeenCalledWith(
        departmentCollection,
        ...additionalDepartments.map(expect.objectContaining),
      );
      expect(comp.departmentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Priority query and add missing value', () => {
      const incident: IIncident = { id: 456 };
      const priority: IPriority = { id: 569 };
      incident.priority = priority;

      const priorityCollection: IPriority[] = [{ id: 4744 }];
      jest.spyOn(priorityService, 'query').mockReturnValue(of(new HttpResponse({ body: priorityCollection })));
      const additionalPriorities = [priority];
      const expectedCollection: IPriority[] = [...additionalPriorities, ...priorityCollection];
      jest.spyOn(priorityService, 'addPriorityToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ incident });
      comp.ngOnInit();

      expect(priorityService.query).toHaveBeenCalled();
      expect(priorityService.addPriorityToCollectionIfMissing).toHaveBeenCalledWith(
        priorityCollection,
        ...additionalPriorities.map(expect.objectContaining),
      );
      expect(comp.prioritiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Status query and add missing value', () => {
      const incident: IIncident = { id: 456 };
      const status: IStatus = { id: 10831 };
      incident.status = status;

      const statusCollection: IStatus[] = [{ id: 13533 }];
      jest.spyOn(statusService, 'query').mockReturnValue(of(new HttpResponse({ body: statusCollection })));
      const additionalStatuses = [status];
      const expectedCollection: IStatus[] = [...additionalStatuses, ...statusCollection];
      jest.spyOn(statusService, 'addStatusToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ incident });
      comp.ngOnInit();

      expect(statusService.query).toHaveBeenCalled();
      expect(statusService.addStatusToCollectionIfMissing).toHaveBeenCalledWith(
        statusCollection,
        ...additionalStatuses.map(expect.objectContaining),
      );
      expect(comp.statusesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call UserApp query and add missing value', () => {
      const incident: IIncident = { id: 456 };
      const userApp: IUserApp = { id: 11124 };
      incident.userApp = userApp;

      const userAppCollection: IUserApp[] = [{ id: 28081 }];
      jest.spyOn(userAppService, 'query').mockReturnValue(of(new HttpResponse({ body: userAppCollection })));
      const additionalUserApps = [userApp];
      const expectedCollection: IUserApp[] = [...additionalUserApps, ...userAppCollection];
      jest.spyOn(userAppService, 'addUserAppToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ incident });
      comp.ngOnInit();

      expect(userAppService.query).toHaveBeenCalled();
      expect(userAppService.addUserAppToCollectionIfMissing).toHaveBeenCalledWith(
        userAppCollection,
        ...additionalUserApps.map(expect.objectContaining),
      );
      expect(comp.userAppsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const incident: IIncident = { id: 456 };
      const user: IUser = { id: 6144 };
      incident.user = user;
      const department: IDepartment = { id: 8662 };
      incident.department = department;
      const priority: IPriority = { id: 3668 };
      incident.priority = priority;
      const status: IStatus = { id: 2049 };
      incident.status = status;
      const userApp: IUserApp = { id: 24692 };
      incident.userApp = userApp;

      activatedRoute.data = of({ incident });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.departmentsSharedCollection).toContain(department);
      expect(comp.prioritiesSharedCollection).toContain(priority);
      expect(comp.statusesSharedCollection).toContain(status);
      expect(comp.userAppsSharedCollection).toContain(userApp);
      expect(comp.incident).toEqual(incident);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIncident>>();
      const incident = { id: 123 };
      jest.spyOn(incidentFormService, 'getIncident').mockReturnValue(incident);
      jest.spyOn(incidentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ incident });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: incident }));
      saveSubject.complete();

      // THEN
      expect(incidentFormService.getIncident).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(incidentService.update).toHaveBeenCalledWith(expect.objectContaining(incident));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIncident>>();
      const incident = { id: 123 };
      jest.spyOn(incidentFormService, 'getIncident').mockReturnValue({ id: null });
      jest.spyOn(incidentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ incident: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: incident }));
      saveSubject.complete();

      // THEN
      expect(incidentFormService.getIncident).toHaveBeenCalled();
      expect(incidentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIncident>>();
      const incident = { id: 123 };
      jest.spyOn(incidentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ incident });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(incidentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareDepartment', () => {
      it('Should forward to departmentService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(departmentService, 'compareDepartment');
        comp.compareDepartment(entity, entity2);
        expect(departmentService.compareDepartment).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('comparePriority', () => {
      it('Should forward to priorityService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(priorityService, 'comparePriority');
        comp.comparePriority(entity, entity2);
        expect(priorityService.comparePriority).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareStatus', () => {
      it('Should forward to statusService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(statusService, 'compareStatus');
        comp.compareStatus(entity, entity2);
        expect(statusService.compareStatus).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareUserApp', () => {
      it('Should forward to userAppService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userAppService, 'compareUserApp');
        comp.compareUserApp(entity, entity2);
        expect(userAppService.compareUserApp).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
