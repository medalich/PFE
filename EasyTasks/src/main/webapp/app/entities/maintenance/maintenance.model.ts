import dayjs from 'dayjs/esm';
import { IRessource } from 'app/entities/ressource/ressource.model';
import { Etat } from 'app/entities/enumerations/etat.model';

export interface IMaintenance {
  id: number;
  description?: string | null;
  produit?: string | null;
  solution?: string | null;
  etat?: Etat | null;
  dateDebut?: dayjs.Dayjs | null;
  dateFin?: dayjs.Dayjs | null;
  duree?: number | null;
  ressource?: Pick<IRessource, 'id' | 'nom'> | null;
}

export type NewMaintenance = Omit<IMaintenance, 'id'> & { id: null };
