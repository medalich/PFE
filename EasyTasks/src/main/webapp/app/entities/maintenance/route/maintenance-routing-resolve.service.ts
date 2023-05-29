import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMaintenance } from '../maintenance.model';
import { MaintenanceService } from '../service/maintenance.service';

@Injectable({ providedIn: 'root' })
export class MaintenanceRoutingResolveService implements Resolve<IMaintenance | null> {
  constructor(protected service: MaintenanceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMaintenance | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((maintenance: HttpResponse<IMaintenance>) => {
          if (maintenance.body) {
            return of(maintenance.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
