import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILivrable, NewLivrable } from '../livrable.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILivrable for edit and NewLivrableFormGroupInput for create.
 */
type LivrableFormGroupInput = ILivrable | PartialWithRequiredKeyOf<NewLivrable>;

type LivrableFormDefaults = Pick<NewLivrable, 'id'>;

type LivrableFormGroupContent = {
  id: FormControl<ILivrable['id'] | NewLivrable['id']>;
  refLivrable: FormControl<ILivrable['refLivrable']>;
  dateDebut: FormControl<ILivrable['dateDebut']>;
  dateFin: FormControl<ILivrable['dateFin']>;
  description: FormControl<ILivrable['description']>;
  etat: FormControl<ILivrable['etat']>;
  projet: FormControl<ILivrable['projet']>;
  facture: FormControl<ILivrable['facture']>;
};

export type LivrableFormGroup = FormGroup<LivrableFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LivrableFormService {
  createLivrableFormGroup(livrable: LivrableFormGroupInput = { id: null }): LivrableFormGroup {
    const livrableRawValue = {
      ...this.getFormDefaults(),
      ...livrable,
    };
    return new FormGroup<LivrableFormGroupContent>({
      id: new FormControl(
        { value: livrableRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      refLivrable: new FormControl(livrableRawValue.refLivrable, {
        validators: [Validators.required, Validators.maxLength(20)],
      }),
      dateDebut: new FormControl(livrableRawValue.dateDebut, {
        validators: [Validators.required],
      }),
      dateFin: new FormControl(livrableRawValue.dateFin),
      description: new FormControl(livrableRawValue.description, {
        validators: [Validators.required],
      }),
      etat: new FormControl(livrableRawValue.etat),
      projet: new FormControl(livrableRawValue.projet, {
        validators: [Validators.required],
      }),
      facture: new FormControl(livrableRawValue.facture),
    });
  }

  getLivrable(form: LivrableFormGroup): ILivrable | NewLivrable {
    return form.getRawValue() as ILivrable | NewLivrable;
  }

  resetForm(form: LivrableFormGroup, livrable: LivrableFormGroupInput): void {
    const livrableRawValue = { ...this.getFormDefaults(), ...livrable };
    form.reset(
      {
        ...livrableRawValue,
        id: { value: livrableRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LivrableFormDefaults {
    return {
      id: null,
    };
  }
}
