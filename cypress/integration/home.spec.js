
import { createSelector } from '../utils/createSelector';

describe('Landing Page', () => {
    describe('when not authenticated', () => {
      before(() => {
        cy.logout()
        cy.visit('/')
      })
      it('should have signin button that redirects to signin page', () => {
        cy.get(createSelector('signin-btn'))
        .last()
        .click({ force: true })
        cy.url().should('contain', '/signin')
      });
      it('should have signup button that redirects to signup page', () => {
        cy.get(createSelector('signup-btn'))
        .last()
        .click({ force: true })
        cy.url().should('contain', '/signup')
      });
    })
  
    describe('when authenticated', () => {
      before(() => {
        cy.login()
        cy.visit('/')
      })
  
      it('should have user profile and logout button', () => {
        cy.get(createSelector('profile-btn')).should('be.visible');
        cy.get(createSelector('logout-btn')).should('be.visible');
      })
    })
});