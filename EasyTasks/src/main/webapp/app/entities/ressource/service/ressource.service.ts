import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRessource, NewRessource } from '../ressource.model';

export type PartialUpdateRessource = Partial<IRessource> & Pick<IRessource, 'id'>;

export type EntityResponseType = HttpResponse<IRessource>;
export type EntityArrayResponseType = HttpResponse<IRessource[]>;

@Injectable({ providedIn: 'root' })
export class RessourceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ressources');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(ressource: NewRessource): Observable<EntityResponseType> {
    return this.http.post<IRessource>(this.resourceUrl, ressource, { observe: 'response' });
  }

  update(ressource: IRessource): Observable<EntityResponseType> {
    return this.http.put<IRessource>(`${this.resourceUrl}/${this.getRessourceIdentifier(ressource)}`, ressource, { observe: 'response' });
  }

  partialUpdate(ressource: PartialUpdateRessource): Observable<EntityResponseType> {
    return this.http.patch<IRessource>(`${this.resourceUrl}/${this.getRessourceIdentifier(ressource)}`, ressource, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRessource>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRessource[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRessourceIdentifier(ressource: Pick<IRessource, 'id'>): number {
    return ressource.id;
  }

  compareRessource(o1: Pick<IRessource, 'id'> | null, o2: Pick<IRessource, 'id'> | null): boolean {
    return o1 && o2 ? this.getRessourceIdentifier(o1) === this.getRessourceIdentifier(o2) : o1 === o2;
  }

  addRessourceToCollectionIfMissing<Type extends Pick<IRessource, 'id'>>(
    ressourceCollection: Type[],
    ...ressourcesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const ressources: Type[] = ressourcesToCheck.filter(isPresent);
    if (ressources.length > 0) {
      const ressourceCollectionIdentifiers = ressourceCollection.map(ressourceItem => this.getRessourceIdentifier(ressourceItem)!);
      const ressourcesToAdd = ressources.filter(ressourceItem => {
        const ressourceIdentifier = this.getRessourceIdentifier(ressourceItem);
        if (ressourceCollectionIdentifiers.includes(ressourceIdentifier)) {
          return false;
        }
        ressourceCollectionIdentifiers.push(ressourceIdentifier);
        return true;
      });
      return [...ressourcesToAdd, ...ressourceCollection];
    }
    return ressourceCollection;
  }
}
