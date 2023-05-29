import dayjs from 'dayjs/esm';

import { TypeCharge } from 'app/entities/enumerations/type-charge.model';

import { IChargeJournaliere, NewChargeJournaliere } from './charge-journaliere.model';

export const sampleWithRequiredData: IChargeJournaliere = {
  id: 84170,
};

export const sampleWithPartialData: IChargeJournaliere = {
  id: 82030,
  description: 'Limousin Wooden',
  type: TypeCharge['Dev'],
  duree: 71430,
};

export const sampleWithFullData: IChargeJournaliere = {
  id: 22533,
  description: 'Awesome benchmark synergy',
  date: dayjs('2023-05-07'),
  type: TypeCharge['Dev'],
  duree: 31268,
};

export const sampleWithNewData: NewChargeJournaliere = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
