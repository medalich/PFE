import dayjs from 'dayjs/esm';
import { ILivrable } from 'app/entities/livrable/livrable.model';
import { Etat } from 'app/entities/enumerations/etat.model';

export interface IActivite {
  id: number;
  refAct?: string | null;
  description?: string | null;
  dateDebut?: dayjs.Dayjs | null;
  dateFin?: dayjs.Dayjs | null;
  raf?: string | null;
  etat?: Etat | null;
  livrable?: Pick<ILivrable, 'id' | 'refLivrable'> | null;
}

export type NewActivite = Omit<IActivite, 'id'> & { id: null };
