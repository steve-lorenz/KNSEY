import { createSelector } from '../utils/createSelector';

const MOCK_CITY_ID = 'I3esteQ9pPQw2F0CqaFJ';

const mockCity = {
  average: 4,
  cityName: 'Angel Grove',
  coords:
    {
      latitude: 45.0994,
      longitude: -122.4783,
    },
  country: 'United States',
  state: 'Power Town',
  totalRanking: 1,
};

const mockComment = {
  cityId: MOCK_CITY_ID,
  content: 'Test comment',
  createdAt: new Date(),
  userFirstName: 'test',
  userId: Cypress.env('TEST_UID'),
  userLastName: 'testy',
};

describe('Comment', () => {
  beforeEach(() => {
    cy.login();
    cy.callFirestore('set', `cities/${MOCK_CITY_ID}`, mockCity);
    cy.visit(MOCK_CITY_ID);
  });

  afterEach(() => {
    // Cleanup city
    cy.callFirestore('delete', `cities/${MOCK_CITY_ID}`);
  });

  it('should be able to add a comment', () => {
    cy.get(createSelector('comment-content')).type('Test comment');
    cy.get(createSelector('comment-btn')).click();
    cy.get(createSelector('comment-collection-item')).contains('Test comment');
    // Cleanup comment
    cy.get(createSelector('comment-delete-btn')).click();
  });

  it('should be able to edit a comment', () => {
    cy.get(createSelector('comment-content')).type('Test comment ');
    cy.get(createSelector('comment-btn')).click();
    cy.get(createSelector('comment-collection-item')).contains('Test comment');
    cy.get(createSelector('comment-edit-btn')).click();
    cy.get(createSelector('comment-content')).clear().type('updated');
    cy.get(createSelector('comment-btn')).contains('Update').click();
    cy.get(createSelector('comment-collection-item')).contains('Test comment updated');
    // Cleanup comment
    cy.get(createSelector('comment-delete-btn')).click();
  });

  it('should be able to delete a comment', () => {
    cy.callFirestore('add', 'comments', mockComment);
    cy.get(createSelector('comment-delete-btn')).click({ multiple: true });
    cy.get(createSelector('comment-collection-item')).should('not.be.visible');
  });
});
