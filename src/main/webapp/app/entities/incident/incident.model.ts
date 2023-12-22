import dayjs from 'dayjs/esm';
import { IComment } from 'app/entities/comment/comment.model';
import { IUser } from 'app/entities/user/user.model';
import { IDepartment } from 'app/entities/department/department.model';
import { IPriority } from 'app/entities/priority/priority.model';
import { IStatus } from 'app/entities/status/status.model';
import { IUserApp } from 'app/entities/user-app/user-app.model';

export interface IIncident {
  id: number;
  title?: string | null;
  description?: string | null;
  creationDate?: dayjs.Dayjs | null;
  updateDate?: dayjs.Dayjs | null;
  resolutionDate?: dayjs.Dayjs | null;
  comments?: IComment[] | null;
  user?: Pick<IUser, 'id'> | null;
  department?: IDepartment | null;
  priority?: IPriority | null;
  status?: IStatus | null;
  userApp?: IUserApp | null;
}

export type NewIncident = Omit<IIncident, 'id'> & { id: null };
