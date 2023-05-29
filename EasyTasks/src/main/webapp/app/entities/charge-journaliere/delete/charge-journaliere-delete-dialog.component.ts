import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IChargeJournaliere } from '../charge-journaliere.model';
import { ChargeJournaliereService } from '../service/charge-journaliere.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './charge-journaliere-delete-dialog.component.html',
})
export class ChargeJournaliereDeleteDialogComponent {
  chargeJournaliere?: IChargeJournaliere;

  constructor(protected chargeJournaliereService: ChargeJournaliereService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.chargeJournaliereService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
