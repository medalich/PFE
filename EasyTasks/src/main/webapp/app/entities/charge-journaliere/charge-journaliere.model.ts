import dayjs from 'dayjs/esm';
import { IRessource } from 'app/entities/ressource/ressource.model';
import { TypeCharge } from 'app/entities/enumerations/type-charge.model';

export interface IChargeJournaliere {
  id: number;
  description?: string | null;
  date?: dayjs.Dayjs | null;
  type?: TypeCharge | null;
  duree?: number | null;
  ressource?: Pick<IRessource, 'id' | 'nom'> | null;
}

export type NewChargeJournaliere = Omit<IChargeJournaliere, 'id'> & { id: null };
