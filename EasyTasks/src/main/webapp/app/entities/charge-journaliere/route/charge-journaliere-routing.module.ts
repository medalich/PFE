import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChargeJournaliereComponent } from '../list/charge-journaliere.component';
import { ChargeJournaliereDetailComponent } from '../detail/charge-journaliere-detail.component';
import { ChargeJournaliereUpdateComponent } from '../update/charge-journaliere-update.component';
import { ChargeJournaliereRoutingResolveService } from './charge-journaliere-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const chargeJournaliereRoute: Routes = [
  {
    path: '',
    component: ChargeJournaliereComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChargeJournaliereDetailComponent,
    resolve: {
      chargeJournaliere: ChargeJournaliereRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChargeJournaliereUpdateComponent,
    resolve: {
      chargeJournaliere: ChargeJournaliereRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChargeJournaliereUpdateComponent,
    resolve: {
      chargeJournaliere: ChargeJournaliereRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(chargeJournaliereRoute)],
  exports: [RouterModule],
})
export class ChargeJournaliereRoutingModule {}
