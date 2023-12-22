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

describe('UserApp e2e test', () => {
  const userAppPageUrl = '/user-app';
  const userAppPageUrlPattern = new RegExp('/user-app(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const userAppSample = { phone: '832-316-0911 x19305' };

  let userApp;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/user-apps+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/user-apps').as('postEntityRequest');
    cy.intercept('DELETE', '/api/user-apps/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (userApp) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/user-apps/${userApp.id}`,
      }).then(() => {
        userApp = undefined;
      });
    }
  });

  it('UserApps menu should load UserApps page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('user-app');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('UserApp').should('exist');
    cy.url().should('match', userAppPageUrlPattern);
  });

  describe('UserApp page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(userAppPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create UserApp page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/user-app/new$'));
        cy.getEntityCreateUpdateHeading('UserApp');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userAppPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/user-apps',
          body: userAppSample,
        }).then(({ body }) => {
          userApp = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/user-apps+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/user-apps?page=0&size=20>; rel="last",<http://localhost/api/user-apps?page=0&size=20>; rel="first"',
              },
              body: [userApp],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(userAppPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details UserApp page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('userApp');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userAppPageUrlPattern);
      });

      it('edit button click should load edit UserApp page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserApp');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userAppPageUrlPattern);
      });

      it('edit button click should load edit UserApp page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserApp');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userAppPageUrlPattern);
      });

      it('last delete button click should delete instance of UserApp', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('userApp').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userAppPageUrlPattern);

        userApp = undefined;
      });
    });
  });

  describe('new UserApp page', () => {
    beforeEach(() => {
      cy.visit(`${userAppPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('UserApp');
    });

    it('should create an instance of UserApp', () => {
      cy.get(`[data-cy="phone"]`).type('(453) 643-8043 x31979');
      cy.get(`[data-cy="phone"]`).should('have.value', '(453) 643-8043 x31979');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        userApp = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', userAppPageUrlPattern);
    });
  });
});
