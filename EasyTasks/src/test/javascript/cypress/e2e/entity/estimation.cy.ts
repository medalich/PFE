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

describe('Estimation e2e test', () => {
  const estimationPageUrl = '/estimation';
  const estimationPageUrlPattern = new RegExp('/estimation(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const estimationSample = {};

  let estimation;
  // let projet;
  // let livrable;
  // let activite;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/projets',
      body: {"refProjet":"Sleek SMS Hat","type":"Externe","description":"generating Iceland enhance","datedebut":"2023-05-07","datefin":"2023-05-06","etat":"Termine"},
    }).then(({ body }) => {
      projet = body;
    });
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/livrables',
      body: {"refLivrable":"sticky payment Auto","dateDebut":"2023-05-07","dateFin":"2023-05-07","description":"Plastic generating Suriname","etat":"Termine"},
    }).then(({ body }) => {
      livrable = body;
    });
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/activites',
      body: {"refAct":"Tala","description":"compressing","dateDebut":"2023-05-07","dateFin":"2023-05-06","raf":"transmitting Chips","etat":"Termine"},
    }).then(({ body }) => {
      activite = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/estimations+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/estimations').as('postEntityRequest');
    cy.intercept('DELETE', '/api/estimations/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/projets', {
      statusCode: 200,
      body: [projet],
    });

    cy.intercept('GET', '/api/livrables', {
      statusCode: 200,
      body: [livrable],
    });

    cy.intercept('GET', '/api/activites', {
      statusCode: 200,
      body: [activite],
    });

  });
   */

  afterEach(() => {
    if (estimation) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/estimations/${estimation.id}`,
      }).then(() => {
        estimation = undefined;
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
    if (livrable) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/livrables/${livrable.id}`,
      }).then(() => {
        livrable = undefined;
      });
    }
    if (activite) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/activites/${activite.id}`,
      }).then(() => {
        activite = undefined;
      });
    }
  });
   */

  it('Estimations menu should load Estimations page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('estimation');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Estimation').should('exist');
    cy.url().should('match', estimationPageUrlPattern);
  });

  describe('Estimation page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(estimationPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Estimation page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/estimation/new$'));
        cy.getEntityCreateUpdateHeading('Estimation');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', estimationPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/estimations',
          body: {
            ...estimationSample,
            projet: projet,
            livrable: livrable,
            activite: activite,
          },
        }).then(({ body }) => {
          estimation = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/estimations+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [estimation],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(estimationPageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(estimationPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details Estimation page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('estimation');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', estimationPageUrlPattern);
      });

      it('edit button click should load edit Estimation page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Estimation');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', estimationPageUrlPattern);
      });

      it('edit button click should load edit Estimation page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Estimation');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', estimationPageUrlPattern);
      });

      it.skip('last delete button click should delete instance of Estimation', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('estimation').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', estimationPageUrlPattern);

        estimation = undefined;
      });
    });
  });

  describe('new Estimation page', () => {
    beforeEach(() => {
      cy.visit(`${estimationPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Estimation');
    });

    it.skip('should create an instance of Estimation', () => {
      cy.get(`[data-cy="date"]`).type('2023-05-07').blur().should('have.value', '2023-05-07');

      cy.get(`[data-cy="valeurJour"]`).type('43493').should('have.value', '43493');

      cy.get(`[data-cy="valeurHeure"]`).type('68155').should('have.value', '68155');

      cy.get(`[data-cy="priseEnCharge"]`).should('not.be.checked');
      cy.get(`[data-cy="priseEnCharge"]`).click().should('be.checked');

      cy.get(`[data-cy="type"]`).select('Projet');

      cy.get(`[data-cy="projet"]`).select(1);
      cy.get(`[data-cy="livrable"]`).select(1);
      cy.get(`[data-cy="activite"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        estimation = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', estimationPageUrlPattern);
    });
  });
});
