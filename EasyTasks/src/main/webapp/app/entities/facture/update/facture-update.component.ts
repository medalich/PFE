import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { FactureFormService, FactureFormGroup } from './facture-form.service';
import { IFacture } from '../facture.model';
import { FactureService } from '../service/facture.service';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { IProjet } from 'app/entities/projet/projet.model';
import { ProjetService } from 'app/entities/projet/service/projet.service';
import { StatutFacture } from 'app/entities/enumerations/statut-facture.model';

@Component({
  selector: 'jhi-facture-update',
  templateUrl: './facture-update.component.html',
})
export class FactureUpdateComponent implements OnInit {
  isSaving = false;
  facture: IFacture | null = null;
  statutFactureValues = Object.keys(StatutFacture);

  clientsSharedCollection: IClient[] = [];
  projetsSharedCollection: IProjet[] = [];

  editForm: FactureFormGroup = this.factureFormService.createFactureFormGroup();

  constructor(
    protected factureService: FactureService,
    protected factureFormService: FactureFormService,
    protected clientService: ClientService,
    protected projetService: ProjetService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareClient = (o1: IClient | null, o2: IClient | null): boolean => this.clientService.compareClient(o1, o2);

  compareProjet = (o1: IProjet | null, o2: IProjet | null): boolean => this.projetService.compareProjet(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ facture }) => {
      this.facture = facture;
      if (facture) {
        this.updateForm(facture);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const facture = this.factureFormService.getFacture(this.editForm);
    if (facture.id !== null) {
      this.subscribeToSaveResponse(this.factureService.update(facture));
    } else {
      this.subscribeToSaveResponse(this.factureService.create(facture));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFacture>>): void {
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

  protected updateForm(facture: IFacture): void {
    this.facture = facture;
    this.factureFormService.resetForm(this.editForm, facture);

    this.clientsSharedCollection = this.clientService.addClientToCollectionIfMissing<IClient>(this.clientsSharedCollection, facture.client);
    this.projetsSharedCollection = this.projetService.addProjetToCollectionIfMissing<IProjet>(this.projetsSharedCollection, facture.projet);
  }

  protected loadRelationshipsOptions(): void {
    this.clientService
      .query()
      .pipe(map((res: HttpResponse<IClient[]>) => res.body ?? []))
      .pipe(map((clients: IClient[]) => this.clientService.addClientToCollectionIfMissing<IClient>(clients, this.facture?.client)))
      .subscribe((clients: IClient[]) => (this.clientsSharedCollection = clients));

    this.projetService
      .query()
      .pipe(map((res: HttpResponse<IProjet[]>) => res.body ?? []))
      .pipe(map((projets: IProjet[]) => this.projetService.addProjetToCollectionIfMissing<IProjet>(projets, this.facture?.projet)))
      .subscribe((projets: IProjet[]) => (this.projetsSharedCollection = projets));
  }
}
