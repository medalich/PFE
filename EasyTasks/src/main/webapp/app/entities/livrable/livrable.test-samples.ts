import dayjs from 'dayjs/esm';

import { Etat } from 'app/entities/enumerations/etat.model';

import { ILivrable, NewLivrable } from './livrable.model';

export const sampleWithRequiredData: ILivrable = {
  id: 96229,
  refLivrable: 'c a Rubber',
  dateDebut: dayjs('2023-05-07'),
  description: 'yellow',
};

export const sampleWithPartialData: ILivrable = {
  id: 86756,
  refLivrable: 'Administrateur Rubbe',
  dateDebut: dayjs('2023-05-07'),
  description: 'a Garden',
  etat: Etat['EnCours'],
};

export const sampleWithFullData: ILivrable = {
  id: 91247,
  refLivrable: 'a',
  dateDebut: dayjs('2023-05-06'),
  dateFin: dayjs('2023-05-06'),
  description: 'Wooden payment',
  etat: Etat['Termine'],
};

export const sampleWithNewData: NewLivrable = {
  refLivrable: 'website',
  dateDebut: dayjs('2023-05-07'),
  description: 'b Licensed',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
