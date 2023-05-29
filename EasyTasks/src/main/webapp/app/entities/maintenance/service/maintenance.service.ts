import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMaintenance, NewMaintenance } from '../maintenance.model';

export type PartialUpdateMaintenance = Partial<IMaintenance> & Pick<IMaintenance, 'id'>;

type RestOf<T extends IMaintenance | NewMaintenance> = Omit<T, 'dateDebut' | 'dateFin'> & {
  dateDebut?: string | null;
  dateFin?: string | null;
};

export type RestMaintenance = RestOf<IMaintenance>;

export type NewRestMaintenance = RestOf<NewMaintenance>;

export type PartialUpdateRestMaintenance = RestOf<PartialUpdateMaintenance>;

export type EntityResponseType = HttpResponse<IMaintenance>;
export type EntityArrayResponseType = HttpResponse<IMaintenance[]>;

@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/maintenances');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(maintenance: NewMaintenance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(maintenance);
    return this.http
      .post<RestMaintenance>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(maintenance: IMaintenance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(maintenance);
    return this.http
      .put<RestMaintenance>(`${this.resourceUrl}/${this.getMaintenanceIdentifier(maintenance)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(maintenance: PartialUpdateMaintenance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(maintenance);
    return this.http
      .patch<RestMaintenance>(`${this.resourceUrl}/${this.getMaintenanceIdentifier(maintenance)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestMaintenance>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestMaintenance[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMaintenanceIdentifier(maintenance: Pick<IMaintenance, 'id'>): number {
    return maintenance.id;
  }

  compareMaintenance(o1: Pick<IMaintenance, 'id'> | null, o2: Pick<IMaintenance, 'id'> | null): boolean {
    return o1 && o2 ? this.getMaintenanceIdentifier(o1) === this.getMaintenanceIdentifier(o2) : o1 === o2;
  }

  addMaintenanceToCollectionIfMissing<Type extends Pick<IMaintenance, 'id'>>(
    maintenanceCollection: Type[],
    ...maintenancesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const maintenances: Type[] = maintenancesToCheck.filter(isPresent);
    if (maintenances.length > 0) {
      const maintenanceCollectionIdentifiers = maintenanceCollection.map(
        maintenanceItem => this.getMaintenanceIdentifier(maintenanceItem)!
      );
      const maintenancesToAdd = maintenances.filter(maintenanceItem => {
        const maintenanceIdentifier = this.getMaintenanceIdentifier(maintenanceItem);
        if (maintenanceCollectionIdentifiers.includes(maintenanceIdentifier)) {
          return false;
        }
        maintenanceCollectionIdentifiers.push(maintenanceIdentifier);
        return true;
      });
      return [...maintenancesToAdd, ...maintenanceCollection];
    }
    return maintenanceCollection;
  }

  protected convertDateFromClient<T extends IMaintenance | NewMaintenance | PartialUpdateMaintenance>(maintenance: T): RestOf<T> {
    return {
      ...maintenance,
      dateDebut: maintenance.dateDebut?.format(DATE_FORMAT) ?? null,
      dateFin: maintenance.dateFin?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restMaintenance: RestMaintenance): IMaintenance {
    return {
      ...restMaintenance,
      dateDebut: restMaintenance.dateDebut ? dayjs(restMaintenance.dateDebut) : undefined,
      dateFin: restMaintenance.dateFin ? dayjs(restMaintenance.dateFin) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestMaintenance>): HttpResponse<IMaintenance> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestMaintenance[]>): HttpResponse<IMaintenance[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
