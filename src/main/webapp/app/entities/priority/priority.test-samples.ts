import { IPriority, NewPriority } from './priority.model';

export const sampleWithRequiredData: IPriority = {
  id: 6485,
  name: 'amongst',
  level: 21532,
};

export const sampleWithPartialData: IPriority = {
  id: 9217,
  name: 'sprout well-made real',
  level: 13346,
};

export const sampleWithFullData: IPriority = {
  id: 12600,
  name: 'sharply',
  level: 26356,
};

export const sampleWithNewData: NewPriority = {
  name: 'meanwhile painfully',
  level: 18246,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
