import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEstimation } from '../estimation.model';
import { EstimationService } from '../service/estimation.service';

@Injectable({ providedIn: 'root' })
export class EstimationRoutingResolveService implements Resolve<IEstimation | null> {
  constructor(protected service: EstimationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEstimation | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((estimation: HttpResponse<IEstimation>) => {
          if (estimation.body) {
            return of(estimation.body);
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
