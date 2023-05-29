import dayjs from 'dayjs/esm';

import { Etat } from 'app/entities/enumerations/etat.model';

import { IActivite, NewActivite } from './activite.model';

export const sampleWithRequiredData: IActivite = {
  id: 20271,
  refAct: 'Gorgeous',
  description: 'Handcrafted',
  dateDebut: dayjs('2023-05-07'),
};

export const sampleWithPartialData: IActivite = {
  id: 5748,
  refAct: 'Generic standardizat',
  description: 'Pants magenta',
  dateDebut: dayjs('2023-05-06'),
  dateFin: dayjs('2023-05-07'),
};

export const sampleWithFullData: IActivite = {
  id: 56304,
  refAct: 'bypassing',
  description: 'benchmark system Tanzanie',
  dateDebut: dayjs('2023-05-07'),
  dateFin: dayjs('2023-05-07'),
  raf: 'tan',
  etat: Etat['Termine'],
};

export const sampleWithNewData: NewActivite = {
  refAct: 'Nepalese black',
  description: 'bricks-and-clicks b',
  dateDebut: dayjs('2023-05-06'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
