import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EstimationComponent } from './list/estimation.component';
import { EstimationDetailComponent } from './detail/estimation-detail.component';
import { EstimationUpdateComponent } from './update/estimation-update.component';
import { EstimationDeleteDialogComponent } from './delete/estimation-delete-dialog.component';
import { EstimationRoutingModule } from './route/estimation-routing.module';

@NgModule({
  imports: [SharedModule, EstimationRoutingModule],
  declarations: [EstimationComponent, EstimationDetailComponent, EstimationUpdateComponent, EstimationDeleteDialogComponent],
})
export class EstimationModule {}
