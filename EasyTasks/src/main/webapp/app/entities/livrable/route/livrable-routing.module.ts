import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LivrableComponent } from '../list/livrable.component';
import { LivrableDetailComponent } from '../detail/livrable-detail.component';
import { LivrableUpdateComponent } from '../update/livrable-update.component';
import { LivrableRoutingResolveService } from './livrable-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const livrableRoute: Routes = [
  {
    path: '',
    component: LivrableComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LivrableDetailComponent,
    resolve: {
      livrable: LivrableRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LivrableUpdateComponent,
    resolve: {
      livrable: LivrableRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LivrableUpdateComponent,
    resolve: {
      livrable: LivrableRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(livrableRoute)],
  exports: [RouterModule],
})
export class LivrableRoutingModule {}
