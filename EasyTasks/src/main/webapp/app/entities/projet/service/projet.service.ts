import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProjet, NewProjet } from '../projet.model';

export type PartialUpdateProjet = Partial<IProjet> & Pick<IProjet, 'id'>;

type RestOf<T extends IProjet | NewProjet> = Omit<T, 'datedebut' | 'datefin'> & {
  datedebut?: string | null;
  datefin?: string | null;
};

export type RestProjet = RestOf<IProjet>;

export type NewRestProjet = RestOf<NewProjet>;

export type PartialUpdateRestProjet = RestOf<PartialUpdateProjet>;

export type EntityResponseType = HttpResponse<IProjet>;
export type EntityArrayResponseType = HttpResponse<IProjet[]>;

@Injectable({ providedIn: 'root' })
export class ProjetService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/projets');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(projet: NewProjet): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(projet);
    return this.http
      .post<RestProjet>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(projet: IProjet): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(projet);
    return this.http
      .put<RestProjet>(`${this.resourceUrl}/${this.getProjetIdentifier(projet)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(projet: PartialUpdateProjet): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(projet);
    return this.http
      .patch<RestProjet>(`${this.resourceUrl}/${this.getProjetIdentifier(projet)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestProjet>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestProjet[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProjetIdentifier(projet: Pick<IProjet, 'id'>): number {
    return projet.id;
  }

  compareProjet(o1: Pick<IProjet, 'id'> | null, o2: Pick<IProjet, 'id'> | null): boolean {
    return o1 && o2 ? this.getProjetIdentifier(o1) === this.getProjetIdentifier(o2) : o1 === o2;
  }

  addProjetToCollectionIfMissing<Type extends Pick<IProjet, 'id'>>(
    projetCollection: Type[],
    ...projetsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const projets: Type[] = projetsToCheck.filter(isPresent);
    if (projets.length > 0) {
      const projetCollectionIdentifiers = projetCollection.map(projetItem => this.getProjetIdentifier(projetItem)!);
      const projetsToAdd = projets.filter(projetItem => {
        const projetIdentifier = this.getProjetIdentifier(projetItem);
        if (projetCollectionIdentifiers.includes(projetIdentifier)) {
          return false;
        }
        projetCollectionIdentifiers.push(projetIdentifier);
        return true;
      });
      return [...projetsToAdd, ...projetCollection];
    }
    return projetCollection;
  }

  protected convertDateFromClient<T extends IProjet | NewProjet | PartialUpdateProjet>(projet: T): RestOf<T> {
    return {
      ...projet,
      datedebut: projet.datedebut?.format(DATE_FORMAT) ?? null,
      datefin: projet.datefin?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restProjet: RestProjet): IProjet {
    return {
      ...restProjet,
      datedebut: restProjet.datedebut ? dayjs(restProjet.datedebut) : undefined,
      datefin: restProjet.datefin ? dayjs(restProjet.datefin) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestProjet>): HttpResponse<IProjet> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestProjet[]>): HttpResponse<IProjet[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
