import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../user-app.test-samples';

import { UserAppFormService } from './user-app-form.service';

describe('UserApp Form Service', () => {
  let service: UserAppFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAppFormService);
  });

  describe('Service methods', () => {
    describe('createUserAppFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserAppFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            phone: expect.any(Object),
          }),
        );
      });

      it('passing IUserApp should create a new form with FormGroup', () => {
        const formGroup = service.createUserAppFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            phone: expect.any(Object),
          }),
        );
      });
    });

    describe('getUserApp', () => {
      it('should return NewUserApp for default UserApp initial value', () => {
        const formGroup = service.createUserAppFormGroup(sampleWithNewData);

        const userApp = service.getUserApp(formGroup) as any;

        expect(userApp).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserApp for empty UserApp initial value', () => {
        const formGroup = service.createUserAppFormGroup();

        const userApp = service.getUserApp(formGroup) as any;

        expect(userApp).toMatchObject({});
      });

      it('should return IUserApp', () => {
        const formGroup = service.createUserAppFormGroup(sampleWithRequiredData);

        const userApp = service.getUserApp(formGroup) as any;

        expect(userApp).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUserApp should not enable id FormControl', () => {
        const formGroup = service.createUserAppFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUserApp should disable id FormControl', () => {
        const formGroup = service.createUserAppFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
