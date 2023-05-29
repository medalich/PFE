import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { LivrableFormService, LivrableFormGroup } from './livrable-form.service';
import { ILivrable } from '../livrable.model';
import { LivrableService } from '../service/livrable.service';
import { IProjet } from 'app/entities/projet/projet.model';
import { ProjetService } from 'app/entities/projet/service/projet.service';
import { IFacture } from 'app/entities/facture/facture.model';
import { FactureService } from 'app/entities/facture/service/facture.service';
import { Etat } from 'app/entities/enumerations/etat.model';

@Component({
  selector: 'jhi-livrable-update',
  templateUrl: './livrable-update.component.html',
})
export class LivrableUpdateComponent implements OnInit {
  isSaving = false;
  livrable: ILivrable | null = null;
  etatValues = Object.keys(Etat);

  projetsSharedCollection: IProjet[] = [];
  facturesSharedCollection: IFacture[] = [];

  editForm: LivrableFormGroup = this.livrableFormService.createLivrableFormGroup();

  constructor(
    protected livrableService: LivrableService,
    protected livrableFormService: LivrableFormService,
    protected projetService: ProjetService,
    protected factureService: FactureService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareProjet = (o1: IProjet | null, o2: IProjet | null): boolean => this.projetService.compareProjet(o1, o2);

  compareFacture = (o1: IFacture | null, o2: IFacture | null): boolean => this.factureService.compareFacture(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ livrable }) => {
      this.livrable = livrable;
      if (livrable) {
        this.updateForm(livrable);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const livrable = this.livrableFormService.getLivrable(this.editForm);
    if (livrable.id !== null) {
      this.subscribeToSaveResponse(this.livrableService.update(livrable));
    } else {
      this.subscribeToSaveResponse(this.livrableService.create(livrable));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILivrable>>): void {
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

  protected updateForm(livrable: ILivrable): void {
    this.livrable = livrable;
    this.livrableFormService.resetForm(this.editForm, livrable);

    this.projetsSharedCollection = this.projetService.addProjetToCollectionIfMissing<IProjet>(
      this.projetsSharedCollection,
      livrable.projet
    );
    this.facturesSharedCollection = this.factureService.addFactureToCollectionIfMissing<IFacture>(
      this.facturesSharedCollection,
      livrable.facture
    );
  }

  protected loadRelationshipsOptions(): void {
    this.projetService
      .query()
      .pipe(map((res: HttpResponse<IProjet[]>) => res.body ?? []))
      .pipe(map((projets: IProjet[]) => this.projetService.addProjetToCollectionIfMissing<IProjet>(projets, this.livrable?.projet)))
      .subscribe((projets: IProjet[]) => (this.projetsSharedCollection = projets));

    this.factureService
      .query()
      .pipe(map((res: HttpResponse<IFacture[]>) => res.body ?? []))
      .pipe(map((factures: IFacture[]) => this.factureService.addFactureToCollectionIfMissing<IFacture>(factures, this.livrable?.facture)))
      .subscribe((factures: IFacture[]) => (this.facturesSharedCollection = factures));
  }
}
