import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IChargeJournaliere, NewChargeJournaliere } from '../charge-journaliere.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IChargeJournaliere for edit and NewChargeJournaliereFormGroupInput for create.
 */
type ChargeJournaliereFormGroupInput = IChargeJournaliere | PartialWithRequiredKeyOf<NewChargeJournaliere>;

type ChargeJournaliereFormDefaults = Pick<NewChargeJournaliere, 'id'>;

type ChargeJournaliereFormGroupContent = {
  id: FormControl<IChargeJournaliere['id'] | NewChargeJournaliere['id']>;
  description: FormControl<IChargeJournaliere['description']>;
  date: FormControl<IChargeJournaliere['date']>;
  type: FormControl<IChargeJournaliere['type']>;
  duree: FormControl<IChargeJournaliere['duree']>;
  ressource: FormControl<IChargeJournaliere['ressource']>;
};

export type ChargeJournaliereFormGroup = FormGroup<ChargeJournaliereFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ChargeJournaliereFormService {
  createChargeJournaliereFormGroup(chargeJournaliere: ChargeJournaliereFormGroupInput = { id: null }): ChargeJournaliereFormGroup {
    const chargeJournaliereRawValue = {
      ...this.getFormDefaults(),
      ...chargeJournaliere,
    };
    return new FormGroup<ChargeJournaliereFormGroupContent>({
      id: new FormControl(
        { value: chargeJournaliereRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      description: new FormControl(chargeJournaliereRawValue.description),
      date: new FormControl(chargeJournaliereRawValue.date),
      type: new FormControl(chargeJournaliereRawValue.type),
      duree: new FormControl(chargeJournaliereRawValue.duree),
      ressource: new FormControl(chargeJournaliereRawValue.ressource, {
        validators: [Validators.required],
      }),
    });
  }

  getChargeJournaliere(form: ChargeJournaliereFormGroup): IChargeJournaliere | NewChargeJournaliere {
    return form.getRawValue() as IChargeJournaliere | NewChargeJournaliere;
  }

  resetForm(form: ChargeJournaliereFormGroup, chargeJournaliere: ChargeJournaliereFormGroupInput): void {
    const chargeJournaliereRawValue = { ...this.getFormDefaults(), ...chargeJournaliere };
    form.reset(
      {
        ...chargeJournaliereRawValue,
        id: { value: chargeJournaliereRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ChargeJournaliereFormDefaults {
    return {
      id: null,
    };
  }
}
