import dayjs from 'dayjs/esm';
import { IClient } from 'app/entities/client/client.model';
import { IProjet } from 'app/entities/projet/projet.model';
import { StatutFacture } from 'app/entities/enumerations/statut-facture.model';

export interface IFacture {
  id: number;
  refFacture?: string | null;
  dateFacture?: dayjs.Dayjs | null;
  montant?: number | null;
  description?: string | null;
  etat?: StatutFacture | null;
  client?: Pick<IClient, 'id' | 'nom'> | null;
  projet?: Pick<IProjet, 'id' | 'refProjet'> | null;
}

export type NewFacture = Omit<IFacture, 'id'> & { id: null };
