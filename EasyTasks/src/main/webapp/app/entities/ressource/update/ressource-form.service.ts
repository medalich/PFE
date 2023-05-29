import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IRessource, NewRessource } from '../ressource.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRessource for edit and NewRessourceFormGroupInput for create.
 */
type RessourceFormGroupInput = IRessource | PartialWithRequiredKeyOf<NewRessource>;

type RessourceFormDefaults = Pick<NewRessource, 'id'>;

type RessourceFormGroupContent = {
  id: FormControl<IRessource['id'] | NewRessource['id']>;
  nom: FormControl<IRessource['nom']>;
  prenom: FormControl<IRessource['prenom']>;
};

export type RessourceFormGroup = FormGroup<RessourceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RessourceFormService {
  createRessourceFormGroup(ressource: RessourceFormGroupInput = { id: null }): RessourceFormGroup {
    const ressourceRawValue = {
      ...this.getFormDefaults(),
      ...ressource,
    };
    return new FormGroup<RessourceFormGroupContent>({
      id: new FormControl(
        { value: ressourceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nom: new FormControl(ressourceRawValue.nom, {
        validators: [Validators.required],
      }),
      prenom: new FormControl(ressourceRawValue.prenom, {
        validators: [Validators.required],
      }),
    });
  }

  getRessource(form: RessourceFormGroup): IRessource | NewRessource {
    return form.getRawValue() as IRessource | NewRessource;
  }

  resetForm(form: RessourceFormGroup, ressource: RessourceFormGroupInput): void {
    const ressourceRawValue = { ...this.getFormDefaults(), ...ressource };
    form.reset(
      {
        ...ressourceRawValue,
        id: { value: ressourceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): RessourceFormDefaults {
    return {
      id: null,
    };
  }
}
