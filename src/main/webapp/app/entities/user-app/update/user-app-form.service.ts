import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUserApp, NewUserApp } from '../user-app.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserApp for edit and NewUserAppFormGroupInput for create.
 */
type UserAppFormGroupInput = IUserApp | PartialWithRequiredKeyOf<NewUserApp>;

type UserAppFormDefaults = Pick<NewUserApp, 'id'>;

type UserAppFormGroupContent = {
  id: FormControl<IUserApp['id'] | NewUserApp['id']>;
  phone: FormControl<IUserApp['phone']>;
};

export type UserAppFormGroup = FormGroup<UserAppFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserAppFormService {
  createUserAppFormGroup(userApp: UserAppFormGroupInput = { id: null }): UserAppFormGroup {
    const userAppRawValue = {
      ...this.getFormDefaults(),
      ...userApp,
    };
    return new FormGroup<UserAppFormGroupContent>({
      id: new FormControl(
        { value: userAppRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      phone: new FormControl(userAppRawValue.phone, {
        validators: [Validators.required],
      }),
    });
  }

  getUserApp(form: UserAppFormGroup): IUserApp | NewUserApp {
    return form.getRawValue() as IUserApp | NewUserApp;
  }

  resetForm(form: UserAppFormGroup, userApp: UserAppFormGroupInput): void {
    const userAppRawValue = { ...this.getFormDefaults(), ...userApp };
    form.reset(
      {
        ...userAppRawValue,
        id: { value: userAppRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): UserAppFormDefaults {
    return {
      id: null,
    };
  }
}
