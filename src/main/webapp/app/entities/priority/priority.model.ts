import { IIncident } from 'app/entities/incident/incident.model';

export interface IPriority {
  id: number;
  name?: string | null;
  level?: number | null;
  incidents?: IIncident[] | null;
}

export type NewPriority = Omit<IPriority, 'id'> & { id: null };
