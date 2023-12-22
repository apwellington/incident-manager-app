import { IDepartment, NewDepartment } from './department.model';

export const sampleWithRequiredData: IDepartment = {
  id: 22131,
  name: 'pfft for',
};

export const sampleWithPartialData: IDepartment = {
  id: 16515,
  name: 'knobby busily hummus',
  description: 'impeccable awesome',
};

export const sampleWithFullData: IDepartment = {
  id: 3080,
  name: 'unless royal',
  description: 'hm hmph yearningly',
};

export const sampleWithNewData: NewDepartment = {
  name: 'apud board',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
