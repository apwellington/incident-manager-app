import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUserApp } from '../user-app.model';
import { UserAppService } from '../service/user-app.service';
import { UserAppFormService, UserAppFormGroup } from './user-app-form.service';

@Component({
  standalone: true,
  selector: 'jhi-user-app-update',
  templateUrl: './user-app-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class UserAppUpdateComponent implements OnInit {
  isSaving = false;
  userApp: IUserApp | null = null;

  editForm: UserAppFormGroup = this.userAppFormService.createUserAppFormGroup();

  constructor(
    protected userAppService: UserAppService,
    protected userAppFormService: UserAppFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userApp }) => {
      this.userApp = userApp;
      if (userApp) {
        this.updateForm(userApp);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userApp = this.userAppFormService.getUserApp(this.editForm);
    if (userApp.id !== null) {
      this.subscribeToSaveResponse(this.userAppService.update(userApp));
    } else {
      this.subscribeToSaveResponse(this.userAppService.create(userApp));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserApp>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(userApp: IUserApp): void {
    this.userApp = userApp;
    this.userAppFormService.resetForm(this.editForm, userApp);
  }
}
