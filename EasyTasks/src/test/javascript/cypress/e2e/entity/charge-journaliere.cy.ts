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

describe('ChargeJournaliere e2e test', () => {
  const chargeJournalierePageUrl = '/charge-journaliere';
  const chargeJournalierePageUrlPattern = new RegExp('/charge-journaliere(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const chargeJournaliereSample = {};

  let chargeJournaliere;
  let ressource;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/ressources',
      body: { nom: 'connecting', prenom: 'Handmade' },
    }).then(({ body }) => {
      ressource = body;
    });
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/charge-journalieres+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/charge-journalieres').as('postEntityRequest');
    cy.intercept('DELETE', '/api/charge-journalieres/*').as('deleteEntityRequest');
  });

  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/ressources', {
      statusCode: 200,
      body: [ressource],
    });
  });

  afterEach(() => {
    if (chargeJournaliere) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/charge-journalieres/${chargeJournaliere.id}`,
      }).then(() => {
        chargeJournaliere = undefined;
      });
    }
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

  it('ChargeJournalieres menu should load ChargeJournalieres page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('charge-journaliere');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ChargeJournaliere').should('exist');
    cy.url().should('match', chargeJournalierePageUrlPattern);
  });

  describe('ChargeJournaliere page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(chargeJournalierePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ChargeJournaliere page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/charge-journaliere/new$'));
        cy.getEntityCreateUpdateHeading('ChargeJournaliere');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', chargeJournalierePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/charge-journalieres',
          body: {
            ...chargeJournaliereSample,
            ressource: ressource,
          },
        }).then(({ body }) => {
          chargeJournaliere = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/charge-journalieres+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [chargeJournaliere],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(chargeJournalierePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details ChargeJournaliere page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('chargeJournaliere');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', chargeJournalierePageUrlPattern);
      });

      it('edit button click should load edit ChargeJournaliere page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ChargeJournaliere');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', chargeJournalierePageUrlPattern);
      });

      it('edit button click should load edit ChargeJournaliere page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ChargeJournaliere');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', chargeJournalierePageUrlPattern);
      });

      it('last delete button click should delete instance of ChargeJournaliere', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('chargeJournaliere').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', chargeJournalierePageUrlPattern);

        chargeJournaliere = undefined;
      });
    });
  });

  describe('new ChargeJournaliere page', () => {
    beforeEach(() => {
      cy.visit(`${chargeJournalierePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ChargeJournaliere');
    });

    it('should create an instance of ChargeJournaliere', () => {
      cy.get(`[data-cy="description"]`).type('software').should('have.value', 'software');

      cy.get(`[data-cy="date"]`).type('2023-05-06').blur().should('have.value', '2023-05-06');

      cy.get(`[data-cy="type"]`).select('Dev');

      cy.get(`[data-cy="duree"]`).type('96526').should('have.value', '96526');

      cy.get(`[data-cy="ressource"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        chargeJournaliere = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', chargeJournalierePageUrlPattern);
    });
  });
});
