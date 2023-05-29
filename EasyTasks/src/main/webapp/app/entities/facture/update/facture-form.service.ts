import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IFacture, NewFacture } from '../facture.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFacture for edit and NewFactureFormGroupInput for create.
 */
type FactureFormGroupInput = IFacture | PartialWithRequiredKeyOf<NewFacture>;

type FactureFormDefaults = Pick<NewFacture, 'id'>;

type FactureFormGroupContent = {
  id: FormControl<IFacture['id'] | NewFacture['id']>;
  refFacture: FormControl<IFacture['refFacture']>;
  dateFacture: FormControl<IFacture['dateFacture']>;
  montant: FormControl<IFacture['montant']>;
  description: FormControl<IFacture['description']>;
  etat: FormControl<IFacture['etat']>;
  client: FormControl<IFacture['client']>;
  projet: FormControl<IFacture['projet']>;
};

export type FactureFormGroup = FormGroup<FactureFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FactureFormService {
  createFactureFormGroup(facture: FactureFormGroupInput = { id: null }): FactureFormGroup {
    const factureRawValue = {
      ...this.getFormDefaults(),
      ...facture,
    };
    return new FormGroup<FactureFormGroupContent>({
      id: new FormControl(
        { value: factureRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      refFacture: new FormControl(factureRawValue.refFacture, {
        validators: [Validators.required, Validators.maxLength(20)],
      }),
      dateFacture: new FormControl(factureRawValue.dateFacture),
      montant: new FormControl(factureRawValue.montant),
      description: new FormControl(factureRawValue.description),
      etat: new FormControl(factureRawValue.etat),
      client: new FormControl(factureRawValue.client, {
        validators: [Validators.required],
      }),
      projet: new FormControl(factureRawValue.projet, {
        validators: [Validators.required],
      }),
    });
  }

  getFacture(form: FactureFormGroup): IFacture | NewFacture {
    return form.getRawValue() as IFacture | NewFacture;
  }

  resetForm(form: FactureFormGroup, facture: FactureFormGroupInput): void {
    const factureRawValue = { ...this.getFormDefaults(), ...facture };
    form.reset(
      {
        ...factureRawValue,
        id: { value: factureRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FactureFormDefaults {
    return {
      id: null,
    };
  }
}
