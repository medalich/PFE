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

describe('Livrable e2e test', () => {
  const livrablePageUrl = '/livrable';
  const livrablePageUrlPattern = new RegExp('/livrable(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const livrableSample = {"refLivrable":"Account eyeballs","dateDebut":"2023-05-07","description":"copying Home"};

  let livrable;
  // let projet;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/projets',
      body: {"refProjet":"synthesizing Langued","type":"Externe","description":"Bretagne zero","datedebut":"2023-05-07","datefin":"2023-05-07","etat":"EnCours"},
    }).then(({ body }) => {
      projet = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/livrables+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/livrables').as('postEntityRequest');
    cy.intercept('DELETE', '/api/livrables/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/activites', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/api/estimations', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/api/projets', {
      statusCode: 200,
      body: [projet],
    });

    cy.intercept('GET', '/api/factures', {
      statusCode: 200,
      body: [],
    });

  });
   */

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

  /* Disabled due to incompatibility
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
   */

  it('Livrables menu should load Livrables page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('livrable');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Livrable').should('exist');
    cy.url().should('match', livrablePageUrlPattern);
  });

  describe('Livrable page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(livrablePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Livrable page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/livrable/new$'));
        cy.getEntityCreateUpdateHeading('Livrable');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', livrablePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/livrables',
          body: {
            ...livrableSample,
            projet: projet,
          },
        }).then(({ body }) => {
          livrable = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/livrables+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [livrable],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(livrablePageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(livrablePageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details Livrable page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('livrable');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', livrablePageUrlPattern);
      });

      it('edit button click should load edit Livrable page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Livrable');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', livrablePageUrlPattern);
      });

      it('edit button click should load edit Livrable page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Livrable');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', livrablePageUrlPattern);
      });

      it.skip('last delete button click should delete instance of Livrable', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('livrable').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', livrablePageUrlPattern);

        livrable = undefined;
      });
    });
  });

  describe('new Livrable page', () => {
    beforeEach(() => {
      cy.visit(`${livrablePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Livrable');
    });

    it.skip('should create an instance of Livrable', () => {
      cy.get(`[data-cy="refLivrable"]`).type('a Solférino Wooden').should('have.value', 'a Solférino Wooden');

      cy.get(`[data-cy="dateDebut"]`).type('2023-05-07').blur().should('have.value', '2023-05-07');

      cy.get(`[data-cy="dateFin"]`).type('2023-05-07').blur().should('have.value', '2023-05-07');

      cy.get(`[data-cy="description"]`).type('b').should('have.value', 'b');

      cy.get(`[data-cy="etat"]`).select('EnCours');

      cy.get(`[data-cy="projet"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        livrable = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', livrablePageUrlPattern);
    });
  });
});
