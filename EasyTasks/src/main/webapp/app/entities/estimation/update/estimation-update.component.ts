import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { EstimationFormService, EstimationFormGroup } from './estimation-form.service';
import { IEstimation } from '../estimation.model';
import { EstimationService } from '../service/estimation.service';
import { IProjet } from 'app/entities/projet/projet.model';
import { ProjetService } from 'app/entities/projet/service/projet.service';
import { ILivrable } from 'app/entities/livrable/livrable.model';
import { LivrableService } from 'app/entities/livrable/service/livrable.service';
import { IActivite } from 'app/entities/activite/activite.model';
import { ActiviteService } from 'app/entities/activite/service/activite.service';
import { TypeEntite } from 'app/entities/enumerations/type-entite.model';

@Component({
  selector: 'jhi-estimation-update',
  templateUrl: './estimation-update.component.html',
})
export class EstimationUpdateComponent implements OnInit {
  isSaving = false;
  estimation: IEstimation | null = null;
  typeEntiteValues = Object.keys(TypeEntite);

  projetsSharedCollection: IProjet[] = [];
  livrablesSharedCollection: ILivrable[] = [];
  activitesSharedCollection: IActivite[] = [];

  editForm: EstimationFormGroup = this.estimationFormService.createEstimationFormGroup();

  constructor(
    protected estimationService: EstimationService,
    protected estimationFormService: EstimationFormService,
    protected projetService: ProjetService,
    protected livrableService: LivrableService,
    protected activiteService: ActiviteService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareProjet = (o1: IProjet | null, o2: IProjet | null): boolean => this.projetService.compareProjet(o1, o2);

  compareLivrable = (o1: ILivrable | null, o2: ILivrable | null): boolean => this.livrableService.compareLivrable(o1, o2);

  compareActivite = (o1: IActivite | null, o2: IActivite | null): boolean => this.activiteService.compareActivite(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ estimation }) => {
      this.estimation = estimation;
      if (estimation) {
        this.updateForm(estimation);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const estimation = this.estimationFormService.getEstimation(this.editForm);
    if (estimation.id !== null) {
      this.subscribeToSaveResponse(this.estimationService.update(estimation));
    } else {
      this.subscribeToSaveResponse(this.estimationService.create(estimation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEstimation>>): void {
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

  protected updateForm(estimation: IEstimation): void {
    this.estimation = estimation;
    this.estimationFormService.resetForm(this.editForm, estimation);

    this.projetsSharedCollection = this.projetService.addProjetToCollectionIfMissing<IProjet>(
      this.projetsSharedCollection,
      estimation.projet
    );
    this.livrablesSharedCollection = this.livrableService.addLivrableToCollectionIfMissing<ILivrable>(
      this.livrablesSharedCollection,
      estimation.livrable
    );
    this.activitesSharedCollection = this.activiteService.addActiviteToCollectionIfMissing<IActivite>(
      this.activitesSharedCollection,
      estimation.activite
    );
  }

  protected loadRelationshipsOptions(): void {
    this.projetService
      .query()
      .pipe(map((res: HttpResponse<IProjet[]>) => res.body ?? []))
      .pipe(map((projets: IProjet[]) => this.projetService.addProjetToCollectionIfMissing<IProjet>(projets, this.estimation?.projet)))
      .subscribe((projets: IProjet[]) => (this.projetsSharedCollection = projets));

    this.livrableService
      .query()
      .pipe(map((res: HttpResponse<ILivrable[]>) => res.body ?? []))
      .pipe(
        map((livrables: ILivrable[]) =>
          this.livrableService.addLivrableToCollectionIfMissing<ILivrable>(livrables, this.estimation?.livrable)
        )
      )
      .subscribe((livrables: ILivrable[]) => (this.livrablesSharedCollection = livrables));

    this.activiteService
      .query()
      .pipe(map((res: HttpResponse<IActivite[]>) => res.body ?? []))
      .pipe(
        map((activites: IActivite[]) =>
          this.activiteService.addActiviteToCollectionIfMissing<IActivite>(activites, this.estimation?.activite)
        )
      )
      .subscribe((activites: IActivite[]) => (this.activitesSharedCollection = activites));
  }
}
