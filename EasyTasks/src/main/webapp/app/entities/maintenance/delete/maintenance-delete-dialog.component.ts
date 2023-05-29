import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMaintenance } from '../maintenance.model';
import { MaintenanceService } from '../service/maintenance.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './maintenance-delete-dialog.component.html',
})
export class MaintenanceDeleteDialogComponent {
  maintenance?: IMaintenance;

  constructor(protected maintenanceService: MaintenanceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.maintenanceService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
