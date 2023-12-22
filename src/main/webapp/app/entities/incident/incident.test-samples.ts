import dayjs from 'dayjs/esm';

import { IIncident, NewIncident } from './incident.model';

export const sampleWithRequiredData: IIncident = {
  id: 3844,
  title: 'take-out fickle psst',
  creationDate: dayjs('2023-12-21T00:53'),
};

export const sampleWithPartialData: IIncident = {
  id: 7784,
  title: 'exhort worth um',
  creationDate: dayjs('2023-12-21T00:29'),
  resolutionDate: dayjs('2023-12-21T10:38'),
};

export const sampleWithFullData: IIncident = {
  id: 25588,
  title: 'than if pound',
  description: 'thickness',
  creationDate: dayjs('2023-12-21T12:24'),
  updateDate: dayjs('2023-12-21T18:44'),
  resolutionDate: dayjs('2023-12-21T14:52'),
};

export const sampleWithNewData: NewIncident = {
  title: 'quixotic mmm quirkily',
  creationDate: dayjs('2023-12-20T20:29'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
