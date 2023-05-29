import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILivrable } from '../livrable.model';
import { LivrableService } from '../service/livrable.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './livrable-delete-dialog.component.html',
})
export class LivrableDeleteDialogComponent {
  livrable?: ILivrable;

  constructor(protected livrableService: LivrableService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.livrableService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
