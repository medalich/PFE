import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MaintenanceFormService, MaintenanceFormGroup } from './maintenance-form.service';
import { IMaintenance } from '../maintenance.model';
import { MaintenanceService } from '../service/maintenance.service';
import { IRessource } from 'app/entities/ressource/ressource.model';
import { RessourceService } from 'app/entities/ressource/service/ressource.service';
import { Etat } from 'app/entities/enumerations/etat.model';

@Component({
  selector: 'jhi-maintenance-update',
  templateUrl: './maintenance-update.component.html',
})
export class MaintenanceUpdateComponent implements OnInit {
  isSaving = false;
  maintenance: IMaintenance | null = null;
  etatValues = Object.keys(Etat);

  ressourcesSharedCollection: IRessource[] = [];

  editForm: MaintenanceFormGroup = this.maintenanceFormService.createMaintenanceFormGroup();

  constructor(
    protected maintenanceService: MaintenanceService,
    protected maintenanceFormService: MaintenanceFormService,
    protected ressourceService: RessourceService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareRessource = (o1: IRessource | null, o2: IRessource | null): boolean => this.ressourceService.compareRessource(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ maintenance }) => {
      this.maintenance = maintenance;
      if (maintenance) {
        this.updateForm(maintenance);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const maintenance = this.maintenanceFormService.getMaintenance(this.editForm);
    if (maintenance.id !== null) {
      this.subscribeToSaveResponse(this.maintenanceService.update(maintenance));
    } else {
      this.subscribeToSaveResponse(this.maintenanceService.create(maintenance));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMaintenance>>): void {
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

  protected updateForm(maintenance: IMaintenance): void {
    this.maintenance = maintenance;
    this.maintenanceFormService.resetForm(this.editForm, maintenance);

    this.ressourcesSharedCollection = this.ressourceService.addRessourceToCollectionIfMissing<IRessource>(
      this.ressourcesSharedCollection,
      maintenance.ressource
    );
  }

  protected loadRelationshipsOptions(): void {
    this.ressourceService
      .query()
      .pipe(map((res: HttpResponse<IRessource[]>) => res.body ?? []))
      .pipe(
        map((ressources: IRessource[]) =>
          this.ressourceService.addRessourceToCollectionIfMissing<IRessource>(ressources, this.maintenance?.ressource)
        )
      )
      .subscribe((ressources: IRessource[]) => (this.ressourcesSharedCollection = ressources));
  }
}
