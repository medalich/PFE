import { IClient, NewClient } from './client.model';

export const sampleWithRequiredData: IClient = {
  id: 71655,
  refClient: 'hacking',
  nom: 'primary Poitou-Charentes Concrete',
  prenom: 'asynchronous Account a',
};

export const sampleWithPartialData: IClient = {
  id: 23980,
  refClient: "Devolved d'Azur",
  nom: 'card Reverse-engineered analyzing',
  prenom: 'Som',
};

export const sampleWithFullData: IClient = {
  id: 40065,
  refClient: 'Assistant',
  nom: 'seamless initiatives',
  prenom: 'auxiliary Charlemagne yellow',
  contact: 'copy contextually-based azure',
};

export const sampleWithNewData: NewClient = {
  refClient: 'République JSON pars',
  nom: 'connect',
  prenom: 'EXE Bretagne Vatu',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
