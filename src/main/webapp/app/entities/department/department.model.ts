import { IIncident } from 'app/entities/incident/incident.model';

export interface IDepartment {
  id: number;
  name?: string | null;
  description?: string | null;
  incidents?: IIncident[] | null;
}

export type NewDepartment = Omit<IDepartment, 'id'> & { id: null };
