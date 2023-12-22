import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IIncident, NewIncident } from '../incident.model';

export type PartialUpdateIncident = Partial<IIncident> & Pick<IIncident, 'id'>;

type RestOf<T extends IIncident | NewIncident> = Omit<T, 'creationDate' | 'updateDate' | 'resolutionDate'> & {
  creationDate?: string | null;
  updateDate?: string | null;
  resolutionDate?: string | null;
};

export type RestIncident = RestOf<IIncident>;

export type NewRestIncident = RestOf<NewIncident>;

export type PartialUpdateRestIncident = RestOf<PartialUpdateIncident>;

export type EntityResponseType = HttpResponse<IIncident>;
export type EntityArrayResponseType = HttpResponse<IIncident[]>;

@Injectable({ providedIn: 'root' })
export class IncidentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/incidents');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(incident: NewIncident): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(incident);
    return this.http
      .post<RestIncident>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(incident: IIncident): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(incident);
    return this.http
      .put<RestIncident>(`${this.resourceUrl}/${this.getIncidentIdentifier(incident)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(incident: PartialUpdateIncident): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(incident);
    return this.http
      .patch<RestIncident>(`${this.resourceUrl}/${this.getIncidentIdentifier(incident)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestIncident>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestIncident[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getIncidentIdentifier(incident: Pick<IIncident, 'id'>): number {
    return incident.id;
  }

  compareIncident(o1: Pick<IIncident, 'id'> | null, o2: Pick<IIncident, 'id'> | null): boolean {
    return o1 && o2 ? this.getIncidentIdentifier(o1) === this.getIncidentIdentifier(o2) : o1 === o2;
  }

  addIncidentToCollectionIfMissing<Type extends Pick<IIncident, 'id'>>(
    incidentCollection: Type[],
    ...incidentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const incidents: Type[] = incidentsToCheck.filter(isPresent);
    if (incidents.length > 0) {
      const incidentCollectionIdentifiers = incidentCollection.map(incidentItem => this.getIncidentIdentifier(incidentItem)!);
      const incidentsToAdd = incidents.filter(incidentItem => {
        const incidentIdentifier = this.getIncidentIdentifier(incidentItem);
        if (incidentCollectionIdentifiers.includes(incidentIdentifier)) {
          return false;
        }
        incidentCollectionIdentifiers.push(incidentIdentifier);
        return true;
      });
      return [...incidentsToAdd, ...incidentCollection];
    }
    return incidentCollection;
  }

  protected convertDateFromClient<T extends IIncident | NewIncident | PartialUpdateIncident>(incident: T): RestOf<T> {
    return {
      ...incident,
      creationDate: incident.creationDate?.toJSON() ?? null,
      updateDate: incident.updateDate?.toJSON() ?? null,
      resolutionDate: incident.resolutionDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restIncident: RestIncident): IIncident {
    return {
      ...restIncident,
      creationDate: restIncident.creationDate ? dayjs(restIncident.creationDate) : undefined,
      updateDate: restIncident.updateDate ? dayjs(restIncident.updateDate) : undefined,
      resolutionDate: restIncident.resolutionDate ? dayjs(restIncident.resolutionDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestIncident>): HttpResponse<IIncident> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestIncident[]>): HttpResponse<IIncident[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
