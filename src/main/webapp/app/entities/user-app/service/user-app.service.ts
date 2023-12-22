import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserApp, NewUserApp } from '../user-app.model';

export type PartialUpdateUserApp = Partial<IUserApp> & Pick<IUserApp, 'id'>;

export type EntityResponseType = HttpResponse<IUserApp>;
export type EntityArrayResponseType = HttpResponse<IUserApp[]>;

@Injectable({ providedIn: 'root' })
export class UserAppService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-apps');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(userApp: NewUserApp): Observable<EntityResponseType> {
    return this.http.post<IUserApp>(this.resourceUrl, userApp, { observe: 'response' });
  }

  update(userApp: IUserApp): Observable<EntityResponseType> {
    return this.http.put<IUserApp>(`${this.resourceUrl}/${this.getUserAppIdentifier(userApp)}`, userApp, { observe: 'response' });
  }

  partialUpdate(userApp: PartialUpdateUserApp): Observable<EntityResponseType> {
    return this.http.patch<IUserApp>(`${this.resourceUrl}/${this.getUserAppIdentifier(userApp)}`, userApp, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserApp>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserApp[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserAppIdentifier(userApp: Pick<IUserApp, 'id'>): number {
    return userApp.id;
  }

  compareUserApp(o1: Pick<IUserApp, 'id'> | null, o2: Pick<IUserApp, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserAppIdentifier(o1) === this.getUserAppIdentifier(o2) : o1 === o2;
  }

  addUserAppToCollectionIfMissing<Type extends Pick<IUserApp, 'id'>>(
    userAppCollection: Type[],
    ...userAppsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userApps: Type[] = userAppsToCheck.filter(isPresent);
    if (userApps.length > 0) {
      const userAppCollectionIdentifiers = userAppCollection.map(userAppItem => this.getUserAppIdentifier(userAppItem)!);
      const userAppsToAdd = userApps.filter(userAppItem => {
        const userAppIdentifier = this.getUserAppIdentifier(userAppItem);
        if (userAppCollectionIdentifiers.includes(userAppIdentifier)) {
          return false;
        }
        userAppCollectionIdentifiers.push(userAppIdentifier);
        return true;
      });
      return [...userAppsToAdd, ...userAppCollection];
    }
    return userAppCollection;
  }
}
