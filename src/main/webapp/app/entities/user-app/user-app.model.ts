import { IIncident } from 'app/entities/incident/incident.model';

export interface IUserApp {
  id: number;
  phone?: string | null;
  incidents?: Pick<IIncident, 'id'>[] | null;
}

export type NewUserApp = Omit<IUserApp, 'id'> & { id: null };
