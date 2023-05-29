import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LivrableComponent } from './list/livrable.component';
import { LivrableDetailComponent } from './detail/livrable-detail.component';
import { LivrableUpdateComponent } from './update/livrable-update.component';
import { LivrableDeleteDialogComponent } from './delete/livrable-delete-dialog.component';
import { LivrableRoutingModule } from './route/livrable-routing.module';

@NgModule({
  imports: [SharedModule, LivrableRoutingModule],
  declarations: [LivrableComponent, LivrableDetailComponent, LivrableUpdateComponent, LivrableDeleteDialogComponent],
})
export class LivrableModule {}
