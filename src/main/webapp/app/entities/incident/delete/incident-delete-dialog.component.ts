import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IIncident } from '../incident.model';
import { IncidentService } from '../service/incident.service';

@Component({
  standalone: true,
  templateUrl: './incident-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class IncidentDeleteDialogComponent {
  incident?: IIncident;

  constructor(
    protected incidentService: IncidentService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.incidentService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
