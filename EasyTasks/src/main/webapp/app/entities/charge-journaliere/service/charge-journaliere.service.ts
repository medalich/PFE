import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IChargeJournaliere, NewChargeJournaliere } from '../charge-journaliere.model';

export type PartialUpdateChargeJournaliere = Partial<IChargeJournaliere> & Pick<IChargeJournaliere, 'id'>;

type RestOf<T extends IChargeJournaliere | NewChargeJournaliere> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestChargeJournaliere = RestOf<IChargeJournaliere>;

export type NewRestChargeJournaliere = RestOf<NewChargeJournaliere>;

export type PartialUpdateRestChargeJournaliere = RestOf<PartialUpdateChargeJournaliere>;

export type EntityResponseType = HttpResponse<IChargeJournaliere>;
export type EntityArrayResponseType = HttpResponse<IChargeJournaliere[]>;

@Injectable({ providedIn: 'root' })
export class ChargeJournaliereService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/charge-journalieres');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(chargeJournaliere: NewChargeJournaliere): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(chargeJournaliere);
    return this.http
      .post<RestChargeJournaliere>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(chargeJournaliere: IChargeJournaliere): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(chargeJournaliere);
    return this.http
      .put<RestChargeJournaliere>(`${this.resourceUrl}/${this.getChargeJournaliereIdentifier(chargeJournaliere)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(chargeJournaliere: PartialUpdateChargeJournaliere): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(chargeJournaliere);
    return this.http
      .patch<RestChargeJournaliere>(`${this.resourceUrl}/${this.getChargeJournaliereIdentifier(chargeJournaliere)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestChargeJournaliere>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestChargeJournaliere[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getChargeJournaliereIdentifier(chargeJournaliere: Pick<IChargeJournaliere, 'id'>): number {
    return chargeJournaliere.id;
  }

  compareChargeJournaliere(o1: Pick<IChargeJournaliere, 'id'> | null, o2: Pick<IChargeJournaliere, 'id'> | null): boolean {
    return o1 && o2 ? this.getChargeJournaliereIdentifier(o1) === this.getChargeJournaliereIdentifier(o2) : o1 === o2;
  }

  addChargeJournaliereToCollectionIfMissing<Type extends Pick<IChargeJournaliere, 'id'>>(
    chargeJournaliereCollection: Type[],
    ...chargeJournalieresToCheck: (Type | null | undefined)[]
  ): Type[] {
    const chargeJournalieres: Type[] = chargeJournalieresToCheck.filter(isPresent);
    if (chargeJournalieres.length > 0) {
      const chargeJournaliereCollectionIdentifiers = chargeJournaliereCollection.map(
        chargeJournaliereItem => this.getChargeJournaliereIdentifier(chargeJournaliereItem)!
      );
      const chargeJournalieresToAdd = chargeJournalieres.filter(chargeJournaliereItem => {
        const chargeJournaliereIdentifier = this.getChargeJournaliereIdentifier(chargeJournaliereItem);
        if (chargeJournaliereCollectionIdentifiers.includes(chargeJournaliereIdentifier)) {
          return false;
        }
        chargeJournaliereCollectionIdentifiers.push(chargeJournaliereIdentifier);
        return true;
      });
      return [...chargeJournalieresToAdd, ...chargeJournaliereCollection];
    }
    return chargeJournaliereCollection;
  }

  protected convertDateFromClient<T extends IChargeJournaliere | NewChargeJournaliere | PartialUpdateChargeJournaliere>(
    chargeJournaliere: T
  ): RestOf<T> {
    return {
      ...chargeJournaliere,
      date: chargeJournaliere.date?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restChargeJournaliere: RestChargeJournaliere): IChargeJournaliere {
    return {
      ...restChargeJournaliere,
      date: restChargeJournaliere.date ? dayjs(restChargeJournaliere.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestChargeJournaliere>): HttpResponse<IChargeJournaliere> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestChargeJournaliere[]>): HttpResponse<IChargeJournaliere[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
