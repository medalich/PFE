import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Facture e2e test', () => {
  const facturePageUrl = '/facture';
  const facturePageUrlPattern = new RegExp('/facture(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const factureSample = {"refFacture":"Sudanese deposit"};

  let facture;
  // let client;
  // let projet;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/clients',
      body: {"refClient":"Wooden payment","nom":"quantify Lettonie","prenom":"Avon","contact":"Cotton UIC-Franc"},
    }).then(({ body }) => {
      client = body;
    });
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/projets',
      body: {"refProjet":"partnerships","type":"Externe","description":"Handcrafted magenta Syrie","datedebut":"2023-05-06","datefin":"2023-05-07","etat":"Termine"},
    }).then(({ body }) => {
      projet = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/factures+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/factures').as('postEntityRequest');
    cy.intercept('DELETE', '/api/factures/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/livrables', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/api/clients', {
      statusCode: 200,
      body: [client],
    });

    cy.intercept('GET', '/api/projets', {
      statusCode: 200,
      body: [projet],
    });

  });
   */

  afterEach(() => {
    if (facture) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/factures/${facture.id}`,
      }).then(() => {
        facture = undefined;
      });
    }
  });

  /* Disabled due to incompatibility
  afterEach(() => {
    if (client) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/clients/${client.id}`,
      }).then(() => {
        client = undefined;
      });
    }
    if (projet) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/projets/${projet.id}`,
      }).then(() => {
        projet = undefined;
      });
    }
  });
   */

  it('Factures menu should load Factures page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('facture');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Facture').should('exist');
    cy.url().should('match', facturePageUrlPattern);
  });

  describe('Facture page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(facturePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Facture page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/facture/new$'));
        cy.getEntityCreateUpdateHeading('Facture');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', facturePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/factures',
          body: {
            ...factureSample,
            client: client,
            projet: projet,
          },
        }).then(({ body }) => {
          facture = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/factures+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [facture],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(facturePageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(facturePageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details Facture page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('facture');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', facturePageUrlPattern);
      });

      it('edit button click should load edit Facture page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Facture');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', facturePageUrlPattern);
      });

      it('edit button click should load edit Facture page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Facture');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', facturePageUrlPattern);
      });

      it.skip('last delete button click should delete instance of Facture', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('facture').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', facturePageUrlPattern);

        facture = undefined;
      });
    });
  });

  describe('new Facture page', () => {
    beforeEach(() => {
      cy.visit(`${facturePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Facture');
    });

    it.skip('should create an instance of Facture', () => {
      cy.get(`[data-cy="refFacture"]`).type('defect').should('have.value', 'defect');

      cy.get(`[data-cy="dateFacture"]`).type('2023-05-23').blur().should('have.value', '2023-05-23');

      cy.get(`[data-cy="montant"]`).type('57619').should('have.value', '57619');

      cy.get(`[data-cy="description"]`).type('Executif Hat Sports').should('have.value', 'Executif Hat Sports');

      cy.get(`[data-cy="etat"]`).select('Bloque');

      cy.get(`[data-cy="client"]`).select(1);
      cy.get(`[data-cy="projet"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        facture = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', facturePageUrlPattern);
    });
  });
});
