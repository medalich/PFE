import dayjs from 'dayjs/esm';

import { TypeEntite } from 'app/entities/enumerations/type-entite.model';

import { IEstimation, NewEstimation } from './estimation.model';

export const sampleWithRequiredData: IEstimation = {
  id: 20829,
};

export const sampleWithPartialData: IEstimation = {
  id: 10329,
  date: dayjs('2023-05-06'),
  valeurJour: 10727,
  priseEnCharge: false,
};

export const sampleWithFullData: IEstimation = {
  id: 11114,
  date: dayjs('2023-05-07'),
  valeurJour: 26620,
  valeurHeure: 59095,
  priseEnCharge: true,
  type: TypeEntite['Activite'],
};

export const sampleWithNewData: NewEstimation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
