import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ActiviteFormService, ActiviteFormGroup } from './activite-form.service';
import { IActivite } from '../activite.model';
import { ActiviteService } from '../service/activite.service';
import { ILivrable } from 'app/entities/livrable/livrable.model';
import { LivrableService } from 'app/entities/livrable/service/livrable.service';
import { Etat } from 'app/entities/enumerations/etat.model';

@Component({
  selector: 'jhi-activite-update',
  templateUrl: './activite-update.component.html',
})
export class ActiviteUpdateComponent implements OnInit {
  isSaving = false;
  activite: IActivite | null = null;
  etatValues = Object.keys(Etat);

  livrablesSharedCollection: ILivrable[] = [];

  editForm: ActiviteFormGroup = this.activiteFormService.createActiviteFormGroup();

  constructor(
    protected activiteService: ActiviteService,
    protected activiteFormService: ActiviteFormService,
    protected livrableService: LivrableService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareLivrable = (o1: ILivrable | null, o2: ILivrable | null): boolean => this.livrableService.compareLivrable(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ activite }) => {
      this.activite = activite;
      if (activite) {
        this.updateForm(activite);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const activite = this.activiteFormService.getActivite(this.editForm);
    if (activite.id !== null) {
      this.subscribeToSaveResponse(this.activiteService.update(activite));
    } else {
      this.subscribeToSaveResponse(this.activiteService.create(activite));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IActivite>>): void {
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

  protected updateForm(activite: IActivite): void {
    this.activite = activite;
    this.activiteFormService.resetForm(this.editForm, activite);

    this.livrablesSharedCollection = this.livrableService.addLivrableToCollectionIfMissing<ILivrable>(
      this.livrablesSharedCollection,
      activite.livrable
    );
  }

  protected loadRelationshipsOptions(): void {
    this.livrableService
      .query()
      .pipe(map((res: HttpResponse<ILivrable[]>) => res.body ?? []))
      .pipe(
        map((livrables: ILivrable[]) =>
          this.livrableService.addLivrableToCollectionIfMissing<ILivrable>(livrables, this.activite?.livrable)
        )
      )
      .subscribe((livrables: ILivrable[]) => (this.livrablesSharedCollection = livrables));
  }
}
