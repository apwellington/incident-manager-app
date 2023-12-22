import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IIncident } from 'app/entities/incident/incident.model';
import { IncidentService } from 'app/entities/incident/service/incident.service';
import { IComment } from '../comment.model';
import { CommentService } from '../service/comment.service';
import { CommentFormService, CommentFormGroup } from './comment-form.service';

@Component({
  standalone: true,
  selector: 'jhi-comment-update',
  templateUrl: './comment-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CommentUpdateComponent implements OnInit {
  isSaving = false;
  comment: IComment | null = null;

  incidentsSharedCollection: IIncident[] = [];

  editForm: CommentFormGroup = this.commentFormService.createCommentFormGroup();

  constructor(
    protected commentService: CommentService,
    protected commentFormService: CommentFormService,
    protected incidentService: IncidentService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareIncident = (o1: IIncident | null, o2: IIncident | null): boolean => this.incidentService.compareIncident(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ comment }) => {
      this.comment = comment;
      if (comment) {
        this.updateForm(comment);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const comment = this.commentFormService.getComment(this.editForm);
    if (comment.id !== null) {
      this.subscribeToSaveResponse(this.commentService.update(comment));
    } else {
      this.subscribeToSaveResponse(this.commentService.create(comment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IComment>>): void {
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

  protected updateForm(comment: IComment): void {
    this.comment = comment;
    this.commentFormService.resetForm(this.editForm, comment);

    this.incidentsSharedCollection = this.incidentService.addIncidentToCollectionIfMissing<IIncident>(
      this.incidentsSharedCollection,
      comment.incident,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.incidentService
      .query()
      .pipe(map((res: HttpResponse<IIncident[]>) => res.body ?? []))
      .pipe(
        map((incidents: IIncident[]) =>
          this.incidentService.addIncidentToCollectionIfMissing<IIncident>(incidents, this.comment?.incident),
        ),
      )
      .subscribe((incidents: IIncident[]) => (this.incidentsSharedCollection = incidents));
  }
}
