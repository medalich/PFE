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

describe('Maintenance e2e test', () => {
  const maintenancePageUrl = '/maintenance';
  const maintenancePageUrlPattern = new RegExp('/maintenance(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const maintenanceSample = { description: 'Bhoutan c' };

  let maintenance;
  let ressource;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/ressources',
      body: { nom: 'user-facing action-items', prenom: 'Bhoutan auxiliary lime' },
    }).then(({ body }) => {
      ressource = body;
    });
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/maintenances+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/maintenances').as('postEntityRequest');
    cy.intercept('DELETE', '/api/maintenances/*').as('deleteEntityRequest');
  });

  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/ressources', {
      statusCode: 200,
      body: [ressource],
    });
  });

  afterEach(() => {
    if (maintenance) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/maintenances/${maintenance.id}`,
      }).then(() => {
        maintenance = undefined;
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

  it('Maintenances menu should load Maintenances page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('maintenance');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Maintenance').should('exist');
    cy.url().should('match', maintenancePageUrlPattern);
  });

  describe('Maintenance page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(maintenancePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Maintenance page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/maintenance/new$'));
        cy.getEntityCreateUpdateHeading('Maintenance');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', maintenancePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/maintenances',
          body: {
            ...maintenanceSample,
            ressource: ressource,
          },
        }).then(({ body }) => {
          maintenance = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/maintenances+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [maintenance],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(maintenancePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Maintenance page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('maintenance');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', maintenancePageUrlPattern);
      });

      it('edit button click should load edit Maintenance page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Maintenance');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', maintenancePageUrlPattern);
      });

      it('edit button click should load edit Maintenance page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Maintenance');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', maintenancePageUrlPattern);
      });

      it('last delete button click should delete instance of Maintenance', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('maintenance').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', maintenancePageUrlPattern);

        maintenance = undefined;
      });
    });
  });

  describe('new Maintenance page', () => {
    beforeEach(() => {
      cy.visit(`${maintenancePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Maintenance');
    });

    it('should create an instance of Maintenance', () => {
      cy.get(`[data-cy="description"]`).type('c PNG').should('have.value', 'c PNG');

      cy.get(`[data-cy="produit"]`).type('capacitor').should('have.value', 'capacitor');

      cy.get(`[data-cy="solution"]`).type('Haute-Normandie cross-platform').should('have.value', 'Haute-Normandie cross-platform');

      cy.get(`[data-cy="etat"]`).select('EnCours');

      cy.get(`[data-cy="dateDebut"]`).type('2023-05-07').blur().should('have.value', '2023-05-07');

      cy.get(`[data-cy="dateFin"]`).type('2023-05-06').blur().should('have.value', '2023-05-06');

      cy.get(`[data-cy="duree"]`).type('62126').should('have.value', '62126');

      cy.get(`[data-cy="ressource"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        maintenance = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', maintenancePageUrlPattern);
    });
  });
});
