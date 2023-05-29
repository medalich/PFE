import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEstimation, NewEstimation } from '../estimation.model';

export type PartialUpdateEstimation = Partial<IEstimation> & Pick<IEstimation, 'id'>;

type RestOf<T extends IEstimation | NewEstimation> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestEstimation = RestOf<IEstimation>;

export type NewRestEstimation = RestOf<NewEstimation>;

export type PartialUpdateRestEstimation = RestOf<PartialUpdateEstimation>;

export type EntityResponseType = HttpResponse<IEstimation>;
export type EntityArrayResponseType = HttpResponse<IEstimation[]>;

@Injectable({ providedIn: 'root' })
export class EstimationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/estimations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(estimation: NewEstimation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(estimation);
    return this.http
      .post<RestEstimation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(estimation: IEstimation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(estimation);
    return this.http
      .put<RestEstimation>(`${this.resourceUrl}/${this.getEstimationIdentifier(estimation)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(estimation: PartialUpdateEstimation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(estimation);
    return this.http
      .patch<RestEstimation>(`${this.resourceUrl}/${this.getEstimationIdentifier(estimation)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestEstimation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEstimation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEstimationIdentifier(estimation: Pick<IEstimation, 'id'>): number {
    return estimation.id;
  }

  compareEstimation(o1: Pick<IEstimation, 'id'> | null, o2: Pick<IEstimation, 'id'> | null): boolean {
    return o1 && o2 ? this.getEstimationIdentifier(o1) === this.getEstimationIdentifier(o2) : o1 === o2;
  }

  addEstimationToCollectionIfMissing<Type extends Pick<IEstimation, 'id'>>(
    estimationCollection: Type[],
    ...estimationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const estimations: Type[] = estimationsToCheck.filter(isPresent);
    if (estimations.length > 0) {
      const estimationCollectionIdentifiers = estimationCollection.map(estimationItem => this.getEstimationIdentifier(estimationItem)!);
      const estimationsToAdd = estimations.filter(estimationItem => {
        const estimationIdentifier = this.getEstimationIdentifier(estimationItem);
        if (estimationCollectionIdentifiers.includes(estimationIdentifier)) {
          return false;
        }
        estimationCollectionIdentifiers.push(estimationIdentifier);
        return true;
      });
      return [...estimationsToAdd, ...estimationCollection];
    }
    return estimationCollection;
  }

  protected convertDateFromClient<T extends IEstimation | NewEstimation | PartialUpdateEstimation>(estimation: T): RestOf<T> {
    return {
      ...estimation,
      date: estimation.date?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restEstimation: RestEstimation): IEstimation {
    return {
      ...restEstimation,
      date: restEstimation.date ? dayjs(restEstimation.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestEstimation>): HttpResponse<IEstimation> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestEstimation[]>): HttpResponse<IEstimation[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
