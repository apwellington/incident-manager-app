import dayjs from 'dayjs/esm';

import { IComment, NewComment } from './comment.model';

export const sampleWithRequiredData: IComment = {
  id: 11924,
  content: 'drat if gleefully',
  commentDate: dayjs('2023-12-21T00:25'),
};

export const sampleWithPartialData: IComment = {
  id: 7034,
  content: 'private',
  commentDate: dayjs('2023-12-21T09:37'),
};

export const sampleWithFullData: IComment = {
  id: 2059,
  content: 'ouch underneath',
  commentDate: dayjs('2023-12-21T03:06'),
};

export const sampleWithNewData: NewComment = {
  content: 'collocate sprinter',
  commentDate: dayjs('2023-12-21T14:39'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
