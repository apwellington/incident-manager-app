import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserAppService } from '../service/user-app.service';
import { IUserApp } from '../user-app.model';
import { UserAppFormService } from './user-app-form.service';

import { UserAppUpdateComponent } from './user-app-update.component';

describe('UserApp Management Update Component', () => {
  let comp: UserAppUpdateComponent;
  let fixture: ComponentFixture<UserAppUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userAppFormService: UserAppFormService;
  let userAppService: UserAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), UserAppUpdateComponent],
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
      .overrideTemplate(UserAppUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserAppUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userAppFormService = TestBed.inject(UserAppFormService);
    userAppService = TestBed.inject(UserAppService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const userApp: IUserApp = { id: 456 };

      activatedRoute.data = of({ userApp });
      comp.ngOnInit();

      expect(comp.userApp).toEqual(userApp);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserApp>>();
      const userApp = { id: 123 };
      jest.spyOn(userAppFormService, 'getUserApp').mockReturnValue(userApp);
      jest.spyOn(userAppService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userApp });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userApp }));
      saveSubject.complete();

      // THEN
      expect(userAppFormService.getUserApp).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userAppService.update).toHaveBeenCalledWith(expect.objectContaining(userApp));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserApp>>();
      const userApp = { id: 123 };
      jest.spyOn(userAppFormService, 'getUserApp').mockReturnValue({ id: null });
      jest.spyOn(userAppService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userApp: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userApp }));
      saveSubject.complete();

      // THEN
      expect(userAppFormService.getUserApp).toHaveBeenCalled();
      expect(userAppService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserApp>>();
      const userApp = { id: 123 };
      jest.spyOn(userAppService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userApp });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userAppService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
