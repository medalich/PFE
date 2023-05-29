import dayjs from 'dayjs/esm';

import { StatutFacture } from 'app/entities/enumerations/statut-facture.model';

import { IFacture, NewFacture } from './facture.model';

export const sampleWithRequiredData: IFacture = {
  id: 59520,
  refFacture: 'Granite',
};

export const sampleWithPartialData: IFacture = {
  id: 38889,
  refFacture: 'back application',
  dateFacture: dayjs('2023-05-22'),
  description: 'Fantastic overriding Sausages',
};

export const sampleWithFullData: IFacture = {
  id: 65406,
  refFacture: 'blue Bretagne',
  dateFacture: dayjs('2023-05-22'),
  montant: 72355,
  description: 'Managed',
  etat: StatutFacture['NonPaye'],
};

export const sampleWithNewData: NewFacture = {
  refFacture: 'Basse-Normandie Caum',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
