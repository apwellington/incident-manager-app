import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IIncident, NewIncident } from '../incident.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IIncident for edit and NewIncidentFormGroupInput for create.
 */
type IncidentFormGroupInput = IIncident | PartialWithRequiredKeyOf<NewIncident>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IIncident | NewIncident> = Omit<T, 'creationDate' | 'updateDate' | 'resolutionDate'> & {
  creationDate?: string | null;
  updateDate?: string | null;
  resolutionDate?: string | null;
};

type IncidentFormRawValue = FormValueOf<IIncident>;

type NewIncidentFormRawValue = FormValueOf<NewIncident>;

type IncidentFormDefaults = Pick<NewIncident, 'id' | 'creationDate' | 'updateDate' | 'resolutionDate'>;

type IncidentFormGroupContent = {
  id: FormControl<IncidentFormRawValue['id'] | NewIncident['id']>;
  title: FormControl<IncidentFormRawValue['title']>;
  description: FormControl<IncidentFormRawValue['description']>;
  creationDate: FormControl<IncidentFormRawValue['creationDate']>;
  updateDate: FormControl<IncidentFormRawValue['updateDate']>;
  resolutionDate: FormControl<IncidentFormRawValue['resolutionDate']>;
  user: FormControl<IncidentFormRawValue['user']>;
  department: FormControl<IncidentFormRawValue['department']>;
  priority: FormControl<IncidentFormRawValue['priority']>;
  status: FormControl<IncidentFormRawValue['status']>;
  userApp: FormControl<IncidentFormRawValue['userApp']>;
};

export type IncidentFormGroup = FormGroup<IncidentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class IncidentFormService {
  createIncidentFormGroup(incident: IncidentFormGroupInput = { id: null }): IncidentFormGroup {
    const incidentRawValue = this.convertIncidentToIncidentRawValue({
      ...this.getFormDefaults(),
      ...incident,
    });
    return new FormGroup<IncidentFormGroupContent>({
      id: new FormControl(
        { value: incidentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      title: new FormControl(incidentRawValue.title, {
        validators: [Validators.required],
      }),
      description: new FormControl(incidentRawValue.description),
      creationDate: new FormControl(incidentRawValue.creationDate, {
        validators: [Validators.required],
      }),
      updateDate: new FormControl(incidentRawValue.updateDate),
      resolutionDate: new FormControl(incidentRawValue.resolutionDate),
      user: new FormControl(incidentRawValue.user),
      department: new FormControl(incidentRawValue.department),
      priority: new FormControl(incidentRawValue.priority),
      status: new FormControl(incidentRawValue.status),
      userApp: new FormControl(incidentRawValue.userApp),
    });
  }

  getIncident(form: IncidentFormGroup): IIncident | NewIncident {
    return this.convertIncidentRawValueToIncident(form.getRawValue() as IncidentFormRawValue | NewIncidentFormRawValue);
  }

  resetForm(form: IncidentFormGroup, incident: IncidentFormGroupInput): void {
    const incidentRawValue = this.convertIncidentToIncidentRawValue({ ...this.getFormDefaults(), ...incident });
    form.reset(
      {
        ...incidentRawValue,
        id: { value: incidentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): IncidentFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      creationDate: currentTime,
      updateDate: currentTime,
      resolutionDate: currentTime,
    };
  }

  private convertIncidentRawValueToIncident(rawIncident: IncidentFormRawValue | NewIncidentFormRawValue): IIncident | NewIncident {
    return {
      ...rawIncident,
      creationDate: dayjs(rawIncident.creationDate, DATE_TIME_FORMAT),
      updateDate: dayjs(rawIncident.updateDate, DATE_TIME_FORMAT),
      resolutionDate: dayjs(rawIncident.resolutionDate, DATE_TIME_FORMAT),
    };
  }

  private convertIncidentToIncidentRawValue(
    incident: IIncident | (Partial<NewIncident> & IncidentFormDefaults),
  ): IncidentFormRawValue | PartialWithRequiredKeyOf<NewIncidentFormRawValue> {
    return {
      ...incident,
      creationDate: incident.creationDate ? incident.creationDate.format(DATE_TIME_FORMAT) : undefined,
      updateDate: incident.updateDate ? incident.updateDate.format(DATE_TIME_FORMAT) : undefined,
      resolutionDate: incident.resolutionDate ? incident.resolutionDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
