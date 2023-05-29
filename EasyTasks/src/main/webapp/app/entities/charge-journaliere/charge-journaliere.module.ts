import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ChargeJournaliereComponent } from './list/charge-journaliere.component';
import { ChargeJournaliereDetailComponent } from './detail/charge-journaliere-detail.component';
import { ChargeJournaliereUpdateComponent } from './update/charge-journaliere-update.component';
import { ChargeJournaliereDeleteDialogComponent } from './delete/charge-journaliere-delete-dialog.component';
import { ChargeJournaliereRoutingModule } from './route/charge-journaliere-routing.module';

@NgModule({
  imports: [SharedModule, ChargeJournaliereRoutingModule],
  declarations: [
    ChargeJournaliereComponent,
    ChargeJournaliereDetailComponent,
    ChargeJournaliereUpdateComponent,
    ChargeJournaliereDeleteDialogComponent,
  ],
})
export class ChargeJournaliereModule {}
