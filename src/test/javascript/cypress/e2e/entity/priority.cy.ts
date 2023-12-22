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

describe('Priority e2e test', () => {
  const priorityPageUrl = '/priority';
  const priorityPageUrlPattern = new RegExp('/priority(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const prioritySample = { name: 'until', level: 8859 };

  let priority;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/priorities+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/priorities').as('postEntityRequest');
    cy.intercept('DELETE', '/api/priorities/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (priority) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/priorities/${priority.id}`,
      }).then(() => {
        priority = undefined;
      });
    }
  });

  it('Priorities menu should load Priorities page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('priority');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Priority').should('exist');
    cy.url().should('match', priorityPageUrlPattern);
  });

  describe('Priority page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(priorityPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Priority page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/priority/new$'));
        cy.getEntityCreateUpdateHeading('Priority');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', priorityPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/priorities',
          body: prioritySample,
        }).then(({ body }) => {
          priority = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/priorities+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [priority],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(priorityPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Priority page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('priority');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', priorityPageUrlPattern);
      });

      it('edit button click should load edit Priority page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Priority');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', priorityPageUrlPattern);
      });

      it('edit button click should load edit Priority page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Priority');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', priorityPageUrlPattern);
      });

      it('last delete button click should delete instance of Priority', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('priority').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', priorityPageUrlPattern);

        priority = undefined;
      });
    });
  });

  describe('new Priority page', () => {
    beforeEach(() => {
      cy.visit(`${priorityPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Priority');
    });

    it('should create an instance of Priority', () => {
      cy.get(`[data-cy="name"]`).type('huzzah so');
      cy.get(`[data-cy="name"]`).should('have.value', 'huzzah so');

      cy.get(`[data-cy="level"]`).type('25985');
      cy.get(`[data-cy="level"]`).should('have.value', '25985');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        priority = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', priorityPageUrlPattern);
    });
  });
});
