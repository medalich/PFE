import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILivrable } from '../livrable.model';
import { LivrableService } from '../service/livrable.service';

@Injectable({ providedIn: 'root' })
export class LivrableRoutingResolveService implements Resolve<ILivrable | null> {
  constructor(protected service: LivrableService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILivrable | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((livrable: HttpResponse<ILivrable>) => {
          if (livrable.body) {
            return of(livrable.body);
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
