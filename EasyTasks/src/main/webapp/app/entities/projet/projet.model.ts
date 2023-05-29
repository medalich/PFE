import dayjs from 'dayjs/esm';
import { IClient } from 'app/entities/client/client.model';
import { Type } from 'app/entities/enumerations/type.model';
import { Etat } from 'app/entities/enumerations/etat.model';

export interface IProjet {
  id: number;
  refProjet?: string | null;
  type?: Type | null;
  description?: string | null;
  datedebut?: dayjs.Dayjs | null;
  datefin?: dayjs.Dayjs | null;
  etat?: Etat | null;
  client?: Pick<IClient, 'id' | 'nom'> | null;
}

export type NewProjet = Omit<IProjet, 'id'> & { id: null };
