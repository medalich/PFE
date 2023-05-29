import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IActivite, NewActivite } from '../activite.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IActivite for edit and NewActiviteFormGroupInput for create.
 */
type ActiviteFormGroupInput = IActivite | PartialWithRequiredKeyOf<NewActivite>;

type ActiviteFormDefaults = Pick<NewActivite, 'id'>;

type ActiviteFormGroupContent = {
  id: FormControl<IActivite['id'] | NewActivite['id']>;
  refAct: FormControl<IActivite['refAct']>;
  description: FormControl<IActivite['description']>;
  dateDebut: FormControl<IActivite['dateDebut']>;
  dateFin: FormControl<IActivite['dateFin']>;
  raf: FormControl<IActivite['raf']>;
  etat: FormControl<IActivite['etat']>;
  livrable: FormControl<IActivite['livrable']>;
};

export type ActiviteFormGroup = FormGroup<ActiviteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ActiviteFormService {
  createActiviteFormGroup(activite: ActiviteFormGroupInput = { id: null }): ActiviteFormGroup {
    const activiteRawValue = {
      ...this.getFormDefaults(),
      ...activite,
    };
    return new FormGroup<ActiviteFormGroupContent>({
      id: new FormControl(
        { value: activiteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      refAct: new FormControl(activiteRawValue.refAct, {
        validators: [Validators.required, Validators.maxLength(20)],
      }),
      description: new FormControl(activiteRawValue.description, {
        validators: [Validators.required],
      }),
      dateDebut: new FormControl(activiteRawValue.dateDebut, {
        validators: [Validators.required],
      }),
      dateFin: new FormControl(activiteRawValue.dateFin),
      raf: new FormControl(activiteRawValue.raf),
      etat: new FormControl(activiteRawValue.etat),
      livrable: new FormControl(activiteRawValue.livrable, {
        validators: [Validators.required],
      }),
    });
  }

  getActivite(form: ActiviteFormGroup): IActivite | NewActivite {
    return form.getRawValue() as IActivite | NewActivite;
  }

  resetForm(form: ActiviteFormGroup, activite: ActiviteFormGroupInput): void {
    const activiteRawValue = { ...this.getFormDefaults(), ...activite };
    form.reset(
      {
        ...activiteRawValue,
        id: { value: activiteRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ActiviteFormDefaults {
    return {
      id: null,
    };
  }
}
