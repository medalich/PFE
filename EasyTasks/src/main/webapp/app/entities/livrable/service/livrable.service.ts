import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILivrable, NewLivrable } from '../livrable.model';

export type PartialUpdateLivrable = Partial<ILivrable> & Pick<ILivrable, 'id'>;

type RestOf<T extends ILivrable | NewLivrable> = Omit<T, 'dateDebut' | 'dateFin'> & {
  dateDebut?: string | null;
  dateFin?: string | null;
};

export type RestLivrable = RestOf<ILivrable>;

export type NewRestLivrable = RestOf<NewLivrable>;

export type PartialUpdateRestLivrable = RestOf<PartialUpdateLivrable>;

export type EntityResponseType = HttpResponse<ILivrable>;
export type EntityArrayResponseType = HttpResponse<ILivrable[]>;

@Injectable({ providedIn: 'root' })
export class LivrableService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/livrables');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(livrable: NewLivrable): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(livrable);
    return this.http
      .post<RestLivrable>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(livrable: ILivrable): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(livrable);
    return this.http
      .put<RestLivrable>(`${this.resourceUrl}/${this.getLivrableIdentifier(livrable)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(livrable: PartialUpdateLivrable): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(livrable);
    return this.http
      .patch<RestLivrable>(`${this.resourceUrl}/${this.getLivrableIdentifier(livrable)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestLivrable>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestLivrable[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLivrableIdentifier(livrable: Pick<ILivrable, 'id'>): number {
    return livrable.id;
  }

  compareLivrable(o1: Pick<ILivrable, 'id'> | null, o2: Pick<ILivrable, 'id'> | null): boolean {
    return o1 && o2 ? this.getLivrableIdentifier(o1) === this.getLivrableIdentifier(o2) : o1 === o2;
  }

  addLivrableToCollectionIfMissing<Type extends Pick<ILivrable, 'id'>>(
    livrableCollection: Type[],
    ...livrablesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const livrables: Type[] = livrablesToCheck.filter(isPresent);
    if (livrables.length > 0) {
      const livrableCollectionIdentifiers = livrableCollection.map(livrableItem => this.getLivrableIdentifier(livrableItem)!);
      const livrablesToAdd = livrables.filter(livrableItem => {
        const livrableIdentifier = this.getLivrableIdentifier(livrableItem);
        if (livrableCollectionIdentifiers.includes(livrableIdentifier)) {
          return false;
        }
        livrableCollectionIdentifiers.push(livrableIdentifier);
        return true;
      });
      return [...livrablesToAdd, ...livrableCollection];
    }
    return livrableCollection;
  }

  protected convertDateFromClient<T extends ILivrable | NewLivrable | PartialUpdateLivrable>(livrable: T): RestOf<T> {
    return {
      ...livrable,
      dateDebut: livrable.dateDebut?.format(DATE_FORMAT) ?? null,
      dateFin: livrable.dateFin?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restLivrable: RestLivrable): ILivrable {
    return {
      ...restLivrable,
      dateDebut: restLivrable.dateDebut ? dayjs(restLivrable.dateDebut) : undefined,
      dateFin: restLivrable.dateFin ? dayjs(restLivrable.dateFin) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestLivrable>): HttpResponse<ILivrable> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestLivrable[]>): HttpResponse<ILivrable[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
