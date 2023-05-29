import dayjs from 'dayjs/esm';
import { IProjet } from 'app/entities/projet/projet.model';
import { ILivrable } from 'app/entities/livrable/livrable.model';
import { IActivite } from 'app/entities/activite/activite.model';
import { TypeEntite } from 'app/entities/enumerations/type-entite.model';

export interface IEstimation {
  id: number;
  date?: dayjs.Dayjs | null;
  valeurJour?: number | null;
  valeurHeure?: number | null;
  priseEnCharge?: boolean | null;
  type?: TypeEntite | null;
  projet?: Pick<IProjet, 'id' | 'refProjet'> | null;
  livrable?: Pick<ILivrable, 'id' | 'refLivrable'> | null;
  activite?: Pick<IActivite, 'id' | 'refAct'> | null;
}

export type NewEstimation = Omit<IEstimation, 'id'> & { id: null };
