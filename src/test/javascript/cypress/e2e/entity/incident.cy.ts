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

describe('Incident e2e test', () => {
  const incidentPageUrl = '/incident';
  const incidentPageUrlPattern = new RegExp('/incident(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const incidentSample = { title: 'so minor rasterise', creationDate: '2023-12-20T20:53:59.152Z' };

  let incident;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/incidents+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/incidents').as('postEntityRequest');
    cy.intercept('DELETE', '/api/incidents/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (incident) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/incidents/${incident.id}`,
      }).then(() => {
        incident = undefined;
      });
    }
  });

  it('Incidents menu should load Incidents page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('incident');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Incident').should('exist');
    cy.url().should('match', incidentPageUrlPattern);
  });

  describe('Incident page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(incidentPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Incident page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/incident/new$'));
        cy.getEntityCreateUpdateHeading('Incident');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', incidentPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/incidents',
          body: incidentSample,
        }).then(({ body }) => {
          incident = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/incidents+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [incident],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(incidentPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Incident page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('incident');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', incidentPageUrlPattern);
      });

      it('edit button click should load edit Incident page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Incident');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', incidentPageUrlPattern);
      });

      it('edit button click should load edit Incident page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Incident');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', incidentPageUrlPattern);
      });

      it('last delete button click should delete instance of Incident', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('incident').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', incidentPageUrlPattern);

        incident = undefined;
      });
    });
  });

  describe('new Incident page', () => {
    beforeEach(() => {
      cy.visit(`${incidentPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Incident');
    });

    it('should create an instance of Incident', () => {
      cy.get(`[data-cy="title"]`).type('giggle sentimentalize rudely');
      cy.get(`[data-cy="title"]`).should('have.value', 'giggle sentimentalize rudely');

      cy.get(`[data-cy="description"]`).type('sarcastic reliable wholly');
      cy.get(`[data-cy="description"]`).should('have.value', 'sarcastic reliable wholly');

      cy.get(`[data-cy="creationDate"]`).type('2023-12-20T23:48');
      cy.get(`[data-cy="creationDate"]`).blur();
      cy.get(`[data-cy="creationDate"]`).should('have.value', '2023-12-20T23:48');

      cy.get(`[data-cy="updateDate"]`).type('2023-12-21T18:28');
      cy.get(`[data-cy="updateDate"]`).blur();
      cy.get(`[data-cy="updateDate"]`).should('have.value', '2023-12-21T18:28');

      cy.get(`[data-cy="resolutionDate"]`).type('2023-12-20T22:44');
      cy.get(`[data-cy="resolutionDate"]`).blur();
      cy.get(`[data-cy="resolutionDate"]`).should('have.value', '2023-12-20T22:44');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        incident = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', incidentPageUrlPattern);
    });
  });
});
