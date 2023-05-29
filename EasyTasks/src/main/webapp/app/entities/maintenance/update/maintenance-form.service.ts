import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMaintenance, NewMaintenance } from '../maintenance.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMaintenance for edit and NewMaintenanceFormGroupInput for create.
 */
type MaintenanceFormGroupInput = IMaintenance | PartialWithRequiredKeyOf<NewMaintenance>;

type MaintenanceFormDefaults = Pick<NewMaintenance, 'id'>;

type MaintenanceFormGroupContent = {
  id: FormControl<IMaintenance['id'] | NewMaintenance['id']>;
  description: FormControl<IMaintenance['description']>;
  produit: FormControl<IMaintenance['produit']>;
  solution: FormControl<IMaintenance['solution']>;
  etat: FormControl<IMaintenance['etat']>;
  dateDebut: FormControl<IMaintenance['dateDebut']>;
  dateFin: FormControl<IMaintenance['dateFin']>;
  duree: FormControl<IMaintenance['duree']>;
  ressource: FormControl<IMaintenance['ressource']>;
};

export type MaintenanceFormGroup = FormGroup<MaintenanceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MaintenanceFormService {
  createMaintenanceFormGroup(maintenance: MaintenanceFormGroupInput = { id: null }): MaintenanceFormGroup {
    const maintenanceRawValue = {
      ...this.getFormDefaults(),
      ...maintenance,
    };
    return new FormGroup<MaintenanceFormGroupContent>({
      id: new FormControl(
        { value: maintenanceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      description: new FormControl(maintenanceRawValue.description, {
        validators: [Validators.required],
      }),
      produit: new FormControl(maintenanceRawValue.produit),
      solution: new FormControl(maintenanceRawValue.solution),
      etat: new FormControl(maintenanceRawValue.etat),
      dateDebut: new FormControl(maintenanceRawValue.dateDebut),
      dateFin: new FormControl(maintenanceRawValue.dateFin),
      duree: new FormControl(maintenanceRawValue.duree),
      ressource: new FormControl(maintenanceRawValue.ressource, {
        validators: [Validators.required],
      }),
    });
  }

  getMaintenance(form: MaintenanceFormGroup): IMaintenance | NewMaintenance {
    return form.getRawValue() as IMaintenance | NewMaintenance;
  }

  resetForm(form: MaintenanceFormGroup, maintenance: MaintenanceFormGroupInput): void {
    const maintenanceRawValue = { ...this.getFormDefaults(), ...maintenance };
    form.reset(
      {
        ...maintenanceRawValue,
        id: { value: maintenanceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MaintenanceFormDefaults {
    return {
      id: null,
    };
  }
}
