import { IIncident } from 'app/entities/incident/incident.model';

export interface IStatus {
  id: number;
  name?: string | null;
  description?: string | null;
  incidents?: IIncident[] | null;
}

export type NewStatus = Omit<IStatus, 'id'> & { id: null };
