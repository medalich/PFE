import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IEstimation, NewEstimation } from '../estimation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEstimation for edit and NewEstimationFormGroupInput for create.
 */
type EstimationFormGroupInput = IEstimation | PartialWithRequiredKeyOf<NewEstimation>;

type EstimationFormDefaults = Pick<NewEstimation, 'id' | 'priseEnCharge'>;

type EstimationFormGroupContent = {
  id: FormControl<IEstimation['id'] | NewEstimation['id']>;
  date: FormControl<IEstimation['date']>;
  valeurJour: FormControl<IEstimation['valeurJour']>;
  valeurHeure: FormControl<IEstimation['valeurHeure']>;
  priseEnCharge: FormControl<IEstimation['priseEnCharge']>;
  type: FormControl<IEstimation['type']>;
  projet: FormControl<IEstimation['projet']>;
  livrable: FormControl<IEstimation['livrable']>;
  activite: FormControl<IEstimation['activite']>;
};

export type EstimationFormGroup = FormGroup<EstimationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EstimationFormService {
  createEstimationFormGroup(estimation: EstimationFormGroupInput = { id: null }): EstimationFormGroup {
    const estimationRawValue = {
      ...this.getFormDefaults(),
      ...estimation,
    };
    return new FormGroup<EstimationFormGroupContent>({
      id: new FormControl(
        { value: estimationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      date: new FormControl(estimationRawValue.date),
      valeurJour: new FormControl(estimationRawValue.valeurJour),
      valeurHeure: new FormControl(estimationRawValue.valeurHeure),
      priseEnCharge: new FormControl(estimationRawValue.priseEnCharge),
      type: new FormControl(estimationRawValue.type),
      projet: new FormControl(estimationRawValue.projet, {
        validators: [Validators.required],
      }),
      livrable: new FormControl(estimationRawValue.livrable, {
        validators: [Validators.required],
      }),
      activite: new FormControl(estimationRawValue.activite, {
        validators: [Validators.required],
      }),
    });
  }

  getEstimation(form: EstimationFormGroup): IEstimation | NewEstimation {
    return form.getRawValue() as IEstimation | NewEstimation;
  }

  resetForm(form: EstimationFormGroup, estimation: EstimationFormGroupInput): void {
    const estimationRawValue = { ...this.getFormDefaults(), ...estimation };
    form.reset(
      {
        ...estimationRawValue,
        id: { value: estimationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EstimationFormDefaults {
    return {
      id: null,
      priseEnCharge: false,
    };
  }
}
