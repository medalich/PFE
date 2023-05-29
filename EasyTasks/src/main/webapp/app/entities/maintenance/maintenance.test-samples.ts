import dayjs from 'dayjs/esm';

import { Etat } from 'app/entities/enumerations/etat.model';

import { IMaintenance, NewMaintenance } from './maintenance.model';

export const sampleWithRequiredData: IMaintenance = {
  id: 62861,
  description: 'SCSI',
};

export const sampleWithPartialData: IMaintenance = {
  id: 6560,
  description: 'Avon',
  dateFin: dayjs('2023-05-07'),
};

export const sampleWithFullData: IMaintenance = {
  id: 73481,
  description: 'Hat',
  produit: 'e-tailers Extended salmon',
  solution: 'robust Cambridgeshire',
  etat: Etat['EnCours'],
  dateDebut: dayjs('2023-05-06'),
  dateFin: dayjs('2023-05-06'),
  duree: 34942,
};

export const sampleWithNewData: NewMaintenance = {
  description: 'maximized Bike Computer',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
