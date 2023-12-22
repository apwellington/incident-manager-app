import { IUserApp, NewUserApp } from './user-app.model';

export const sampleWithRequiredData: IUserApp = {
  id: 28081,
  phone: '592-463-1287 x52498',
};

export const sampleWithPartialData: IUserApp = {
  id: 8662,
  phone: '1-584-387-6801',
};

export const sampleWithFullData: IUserApp = {
  id: 23008,
  phone: '(226) 723-7719 x2564',
};

export const sampleWithNewData: NewUserApp = {
  phone: '558.548.3050',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
