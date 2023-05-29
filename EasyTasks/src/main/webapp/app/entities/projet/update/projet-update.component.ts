import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ProjetFormService, ProjetFormGroup } from './projet-form.service';
import { IProjet } from '../projet.model';
import { ProjetService } from '../service/projet.service';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { Type } from 'app/entities/enumerations/type.model';
import { Etat } from 'app/entities/enumerations/etat.model';

@Component({
  selector: 'jhi-projet-update',
  templateUrl: './projet-update.component.html',
})
export class ProjetUpdateComponent implements OnInit {
  isSaving = false;
  projet: IProjet | null = null;
  typeValues = Object.keys(Type);
  etatValues = Object.keys(Etat);

  clientsSharedCollection: IClient[] = [];

  editForm: ProjetFormGroup = this.projetFormService.createProjetFormGroup();

  constructor(
    protected projetService: ProjetService,
    protected projetFormService: ProjetFormService,
    protected clientService: ClientService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareClient = (o1: IClient | null, o2: IClient | null): boolean => this.clientService.compareClient(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ projet }) => {
      this.projet = projet;
      if (projet) {
        this.updateForm(projet);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const projet = this.projetFormService.getProjet(this.editForm);
    if (projet.id !== null) {
      this.subscribeToSaveResponse(this.projetService.update(projet));
    } else {
      this.subscribeToSaveResponse(this.projetService.create(projet));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProjet>>): void {
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

  protected updateForm(projet: IProjet): void {
    this.projet = projet;
    this.projetFormService.resetForm(this.editForm, projet);

    this.clientsSharedCollection = this.clientService.addClientToCollectionIfMissing<IClient>(this.clientsSharedCollection, projet.client);
  }

  protected loadRelationshipsOptions(): void {
    this.clientService
      .query()
      .pipe(map((res: HttpResponse<IClient[]>) => res.body ?? []))
      .pipe(map((clients: IClient[]) => this.clientService.addClientToCollectionIfMissing<IClient>(clients, this.projet?.client)))
      .subscribe((clients: IClient[]) => (this.clientsSharedCollection = clients));
  }
}
