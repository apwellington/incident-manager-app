import { IStatus, NewStatus } from './status.model';

export const sampleWithRequiredData: IStatus = {
  id: 28606,
  name: 'plus truthfully beneath',
};

export const sampleWithPartialData: IStatus = {
  id: 30171,
  name: 'via enormously',
  description: 'modern',
};

export const sampleWithFullData: IStatus = {
  id: 2305,
  name: 'why',
  description: 'provided colorfully',
};

export const sampleWithNewData: NewStatus = {
  name: 'after dangerous',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
