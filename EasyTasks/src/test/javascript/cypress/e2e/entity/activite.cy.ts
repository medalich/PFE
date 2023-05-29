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

describe('Activite e2e test', () => {
  const activitePageUrl = '/activite';
  const activitePageUrlPattern = new RegExp('/activite(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const activiteSample = {"refAct":"system","description":"software","dateDebut":"2023-05-07"};

  let activite;
  // let livrable;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/livrables',
      body: {"refLivrable":"Games Home","dateDebut":"2023-05-06","dateFin":"2023-05-06","description":"implement convergence plug-and-play","etat":"Planifier"},
    }).then(({ body }) => {
      livrable = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/activites+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/activites').as('postEntityRequest');
    cy.intercept('DELETE', '/api/activites/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/estimations', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/api/livrables', {
      statusCode: 200,
      body: [livrable],
    });

  });
   */

  afterEach(() => {
    if (activite) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/activites/${activite.id}`,
      }).then(() => {
        activite = undefined;
      });
    }
  });

  /* Disabled due to incompatibility
  afterEach(() => {
    if (livrable) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/livrables/${livrable.id}`,
      }).then(() => {
        livrable = undefined;
      });
    }
  });
   */

  it('Activites menu should load Activites page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('activite');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Activite').should('exist');
    cy.url().should('match', activitePageUrlPattern);
  });

  describe('Activite page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(activitePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Activite page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/activite/new$'));
        cy.getEntityCreateUpdateHeading('Activite');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', activitePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/activites',
          body: {
            ...activiteSample,
            livrable: livrable,
          },
        }).then(({ body }) => {
          activite = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/activites+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [activite],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(activitePageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(activitePageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details Activite page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('activite');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', activitePageUrlPattern);
      });

      it('edit button click should load edit Activite page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Activite');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', activitePageUrlPattern);
      });

      it('edit button click should load edit Activite page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Activite');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', activitePageUrlPattern);
      });

      it.skip('last delete button click should delete instance of Activite', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('activite').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', activitePageUrlPattern);

        activite = undefined;
      });
    });
  });

  describe('new Activite page', () => {
    beforeEach(() => {
      cy.visit(`${activitePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Activite');
    });

    it.skip('should create an instance of Activite', () => {
      cy.get(`[data-cy="refAct"]`).type('États-Unis').should('have.value', 'États-Unis');

      cy.get(`[data-cy="description"]`).type('application invoice XML').should('have.value', 'application invoice XML');

      cy.get(`[data-cy="dateDebut"]`).type('2023-05-07').blur().should('have.value', '2023-05-07');

      cy.get(`[data-cy="dateFin"]`).type('2023-05-06').blur().should('have.value', '2023-05-06');

      cy.get(`[data-cy="raf"]`).type('generating Gloves').should('have.value', 'generating Gloves');

      cy.get(`[data-cy="etat"]`).select('Planifier');

      cy.get(`[data-cy="livrable"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        activite = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', activitePageUrlPattern);
    });
  });
});
