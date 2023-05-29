export interface IClient {
  id: number;
  refClient?: string | null;
  nom?: string | null;
  prenom?: string | null;
  contact?: string | null;
}

export type NewClient = Omit<IClient, 'id'> & { id: null };
