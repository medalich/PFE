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

describe('Projet e2e test', () => {
  const projetPageUrl = '/projet';
  const projetPageUrlPattern = new RegExp('/projet(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const projetSample = { refProjet: 'compress driver' };

  let projet;
  let client;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/clients',
      body: { refClient: 'Île-de-France Handcr', nom: 'mindshare', prenom: 'Gorgeous', contact: 'Kids' },
    }).then(({ body }) => {
      client = body;
    });
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/projets+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/projets').as('postEntityRequest');
    cy.intercept('DELETE', '/api/projets/*').as('deleteEntityRequest');
  });

  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/livrables', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/api/estimations', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/api/factures', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/api/clients', {
      statusCode: 200,
      body: [client],
    });
  });

  afterEach(() => {
    if (projet) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/projets/${projet.id}`,
      }).then(() => {
        projet = undefined;
      });
    }
  });

  afterEach(() => {
    if (client) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/clients/${client.id}`,
      }).then(() => {
        client = undefined;
      });
    }
  });

  it('Projets menu should load Projets page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('projet');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Projet').should('exist');
    cy.url().should('match', projetPageUrlPattern);
  });

  describe('Projet page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(projetPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Projet page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/projet/new$'));
        cy.getEntityCreateUpdateHeading('Projet');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projetPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/projets',
          body: {
            ...projetSample,
            client: client,
          },
        }).then(({ body }) => {
          projet = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/projets+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [projet],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(projetPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Projet page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('projet');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projetPageUrlPattern);
      });

      it('edit button click should load edit Projet page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Projet');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projetPageUrlPattern);
      });

      it('edit button click should load edit Projet page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Projet');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projetPageUrlPattern);
      });

      it('last delete button click should delete instance of Projet', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('projet').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projetPageUrlPattern);

        projet = undefined;
      });
    });
  });

  describe('new Projet page', () => {
    beforeEach(() => {
      cy.visit(`${projetPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Projet');
    });

    it('should create an instance of Projet', () => {
      cy.get(`[data-cy="refProjet"]`).type('mobile Manager Alsac').should('have.value', 'mobile Manager Alsac');

      cy.get(`[data-cy="type"]`).select('Externe');

      cy.get(`[data-cy="description"]`).type('COM').should('have.value', 'COM');

      cy.get(`[data-cy="datedebut"]`).type('2023-05-07').blur().should('have.value', '2023-05-07');

      cy.get(`[data-cy="datefin"]`).type('2023-05-06').blur().should('have.value', '2023-05-06');

      cy.get(`[data-cy="etat"]`).select('EnCours');

      cy.get(`[data-cy="client"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        projet = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', projetPageUrlPattern);
    });
  });
});
