import { IRessource, NewRessource } from './ressource.model';

export const sampleWithRequiredData: IRessource = {
  id: 80522,
  nom: 'Buckinghamshire HTTP',
  prenom: 'Hongrie',
};

export const sampleWithPartialData: IRessource = {
  id: 12479,
  nom: 'port Shoes Île-de-France',
  prenom: 'application Networked Tasty',
};

export const sampleWithFullData: IRessource = {
  id: 82139,
  nom: 'content',
  prenom: 'Outdoors facilitate Refined',
};

export const sampleWithNewData: NewRessource = {
  nom: 'Rubber Cambridgeshire Avon',
  prenom: 'invoice',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
