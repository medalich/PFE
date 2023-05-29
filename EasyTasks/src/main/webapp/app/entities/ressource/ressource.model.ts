export interface IRessource {
  id: number;
  nom?: string | null;
  prenom?: string | null;
}

export type NewRessource = Omit<IRessource, 'id'> & { id: null };
