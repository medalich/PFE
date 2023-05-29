import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ChargeJournaliereFormService, ChargeJournaliereFormGroup } from './charge-journaliere-form.service';
import { IChargeJournaliere } from '../charge-journaliere.model';
import { ChargeJournaliereService } from '../service/charge-journaliere.service';
import { IRessource } from 'app/entities/ressource/ressource.model';
import { RessourceService } from 'app/entities/ressource/service/ressource.service';
import { TypeCharge } from 'app/entities/enumerations/type-charge.model';

@Component({
  selector: 'jhi-charge-journaliere-update',
  templateUrl: './charge-journaliere-update.component.html',
})
export class ChargeJournaliereUpdateComponent implements OnInit {
  isSaving = false;
  chargeJournaliere: IChargeJournaliere | null = null;
  typeChargeValues = Object.keys(TypeCharge);

  ressourcesSharedCollection: IRessource[] = [];

  editForm: ChargeJournaliereFormGroup = this.chargeJournaliereFormService.createChargeJournaliereFormGroup();

  constructor(
    protected chargeJournaliereService: ChargeJournaliereService,
    protected chargeJournaliereFormService: ChargeJournaliereFormService,
    protected ressourceService: RessourceService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareRessource = (o1: IRessource | null, o2: IRessource | null): boolean => this.ressourceService.compareRessource(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chargeJournaliere }) => {
      this.chargeJournaliere = chargeJournaliere;
      if (chargeJournaliere) {
        this.updateForm(chargeJournaliere);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const chargeJournaliere = this.chargeJournaliereFormService.getChargeJournaliere(this.editForm);
    if (chargeJournaliere.id !== null) {
      this.subscribeToSaveResponse(this.chargeJournaliereService.update(chargeJournaliere));
    } else {
      this.subscribeToSaveResponse(this.chargeJournaliereService.create(chargeJournaliere));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChargeJournaliere>>): void {
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

  protected updateForm(chargeJournaliere: IChargeJournaliere): void {
    this.chargeJournaliere = chargeJournaliere;
    this.chargeJournaliereFormService.resetForm(this.editForm, chargeJournaliere);

    this.ressourcesSharedCollection = this.ressourceService.addRessourceToCollectionIfMissing<IRessource>(
      this.ressourcesSharedCollection,
      chargeJournaliere.ressource
    );
  }

  protected loadRelationshipsOptions(): void {
    this.ressourceService
      .query()
      .pipe(map((res: HttpResponse<IRessource[]>) => res.body ?? []))
      .pipe(
        map((ressources: IRessource[]) =>
          this.ressourceService.addRessourceToCollectionIfMissing<IRessource>(ressources, this.chargeJournaliere?.ressource)
        )
      )
      .subscribe((ressources: IRessource[]) => (this.ressourcesSharedCollection = ressources));
  }
}
