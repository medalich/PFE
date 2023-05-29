import dayjs from 'dayjs/esm';

import { Type } from 'app/entities/enumerations/type.model';
import { Etat } from 'app/entities/enumerations/etat.model';

import { IProjet, NewProjet } from './projet.model';

export const sampleWithRequiredData: IProjet = {
  id: 59803,
  refProjet: 'b interface',
};

export const sampleWithPartialData: IProjet = {
  id: 25263,
  refProjet: 'invoice',
  datedebut: dayjs('2023-05-06'),
  etat: Etat['Termine'],
};

export const sampleWithFullData: IProjet = {
  id: 85936,
  refProjet: 'up channels',
  type: Type['Externe'],
  description: 'mobile magenta',
  datedebut: dayjs('2023-05-06'),
  datefin: dayjs('2023-05-06'),
  etat: Etat['EnCours'],
};

export const sampleWithNewData: NewProjet = {
  refProjet: 'Computers Granite',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
