import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EstimationComponent } from '../list/estimation.component';
import { EstimationDetailComponent } from '../detail/estimation-detail.component';
import { EstimationUpdateComponent } from '../update/estimation-update.component';
import { EstimationRoutingResolveService } from './estimation-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const estimationRoute: Routes = [
  {
    path: '',
    component: EstimationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EstimationDetailComponent,
    resolve: {
      estimation: EstimationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EstimationUpdateComponent,
    resolve: {
      estimation: EstimationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EstimationUpdateComponent,
    resolve: {
      estimation: EstimationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(estimationRoute)],
  exports: [RouterModule],
})
export class EstimationRoutingModule {}
