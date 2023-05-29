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

describe('Ressource e2e test', () => {
  const ressourcePageUrl = '/ressource';
  const ressourcePageUrlPattern = new RegExp('/ressource(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const ressourceSample = { nom: 'up', prenom: 'a primary' };

  let ressource;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/ressources+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/ressources').as('postEntityRequest');
    cy.intercept('DELETE', '/api/ressources/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (ressource) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/ressources/${ressource.id}`,
      }).then(() => {
        ressource = undefined;
      });
    }
  });

  it('Ressources menu should load Ressources page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('ressource');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Ressource').should('exist');
    cy.url().should('match', ressourcePageUrlPattern);
  });

  describe('Ressource page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(ressourcePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Ressource page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/ressource/new$'));
        cy.getEntityCreateUpdateHeading('Ressource');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', ressourcePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/ressources',
          body: ressourceSample,
        }).then(({ body }) => {
          ressource = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/ressources+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [ressource],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(ressourcePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Ressource page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('ressource');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', ressourcePageUrlPattern);
      });

      it('edit button click should load edit Ressource page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Ressource');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', ressourcePageUrlPattern);
      });

      it('edit button click should load edit Ressource page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Ressource');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', ressourcePageUrlPattern);
      });

      it('last delete button click should delete instance of Ressource', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('ressource').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', ressourcePageUrlPattern);

        ressource = undefined;
      });
    });
  });

  describe('new Ressource page', () => {
    beforeEach(() => {
      cy.visit(`${ressourcePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Ressource');
    });

    it('should create an instance of Ressource', () => {
      cy.get(`[data-cy="nom"]`).type('maximized Bedfordshire deposit').should('have.value', 'maximized Bedfordshire deposit');

      cy.get(`[data-cy="prenom"]`).type('Wooden SDD Shoes').should('have.value', 'Wooden SDD Shoes');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        ressource = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', ressourcePageUrlPattern);
    });
  });
});
