import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IChargeJournaliere } from '../charge-journaliere.model';
import { ChargeJournaliereService } from '../service/charge-journaliere.service';

@Injectable({ providedIn: 'root' })
export class ChargeJournaliereRoutingResolveService implements Resolve<IChargeJournaliere | null> {
  constructor(protected service: ChargeJournaliereService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IChargeJournaliere | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((chargeJournaliere: HttpResponse<IChargeJournaliere>) => {
          if (chargeJournaliere.body) {
            return of(chargeJournaliere.body);
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
