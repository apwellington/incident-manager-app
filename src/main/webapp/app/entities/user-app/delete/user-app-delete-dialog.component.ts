import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IUserApp } from '../user-app.model';
import { UserAppService } from '../service/user-app.service';

@Component({
  standalone: true,
  templateUrl: './user-app-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class UserAppDeleteDialogComponent {
  userApp?: IUserApp;

  constructor(
    protected userAppService: UserAppService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userAppService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
