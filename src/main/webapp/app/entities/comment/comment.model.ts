import dayjs from 'dayjs/esm';
import { IIncident } from 'app/entities/incident/incident.model';

export interface IComment {
  id: number;
  content?: string | null;
  commentDate?: dayjs.Dayjs | null;
  incident?: IIncident | null;
}

export type NewComment = Omit<IComment, 'id'> & { id: null };
