/*
login spec:
- should display login page correctly
- should shown HTML form validation when fields are empty
- should shown HTML form validation when email field is invalid
- should redirect to register page when register link is clicked
- should show teks 'Logging in...' on submit button when login is processing
- should show error message when login failed
- should redirect to home page when login success and should have an user avatar on navbar
*/

describe('login spec', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.url().should('eq', 'http://localhost:5173/login');
  });

  it('should display login page correctly', () => {
    cy.contains('h2', 'Log Into Your Account').should('be.visible');
    cy.contains('p', 'Access the forum and join the discussion.').should('be.visible');
    cy.get('input[type="email"][placeholder="Email"]').should('be.visible');
    cy.get('input[type="password"][placeholder="Password"]').should('be.visible');
    cy.contains('button', /^Login$/).should('be.visible');
    cy.contains('p', 'Don\'t have an account?')
      .should('be.visible')
      .within(() => {
        cy.get('a[href="/register"]').contains('register').should('be.visible');
      });
  });

  it('should shown HTML form validation when fields are empty', () => {
    // fields are empty
    cy.contains('button[type="submit"]', /^Login$/).click();
    cy.get('input:invalid').should('have.length', 2);
    cy.get('input').should(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill out this field.');
      expect($input[1].validationMessage).to.eq('Please fill out this field.');
    });
  });

  it('should shown HTML form validation when email field is invalid', () => {
    cy.get('input[type="email"]').type('invalid-email');
    cy.get('input[type="password"]').type('password');
    cy.contains('button[type="submit"]', /^Login$/).click();
    cy.get('input:invalid').should('have.length', 1);
    cy.get('input:invalid').then(($input) => {
      const message = $input[0].validationMessage;
      expect(message).to.match(/@|email/i);
    });
  });

  it('should redirect to register page when register link is clicked', () => {
    cy.get('a[href="/register"]').click();
    cy.url().should('eq', 'http://localhost:5173/register');
  });

  it('should show teks "Logging in..." on submit button when login is processing', () => {
    // login req intercept
    cy.intercept('POST', 'https://forum-api.dicoding.dev/v1/login', (req) => {
      req.on('response', (res) => {
        res.setDelay(3000);
      });
    }).as('loginRequest');

    cy.get('input[type="email"]').type('testy@mail.com');
    cy.get('input[type="password"]').type('password');
    cy.contains('button[type="submit"]', /^Login$/).click();

    cy.contains('button[type="submit"]', /^Logging in...$/).should(
      'be.visible'
    );

    cy.wait('@loginRequest');

    cy.contains(/^Logging in...$/).should('not.exist');
  });

  it('should show error message when login failed', () => {
    cy.get('input[type="email"]').type('testy@mail.com');
    cy.get('input[type="password"]').type('password');
    cy.contains('button[type="submit"]', /^Login$/).click();
    cy.contains('p.text-red-500', 'email or password is wrong').should('be.visible');
  });

  it('should redirect to home page when login success and have an user avatar on navbar', () => {
    const username = 'testuser2';
    const email = 'testy@mail.com';
    const password = '123456';
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.contains('button[type="submit"]', /^Login$/).click();
    cy.url().should('eq', 'http://localhost:5173/');
    cy.get(`.avatar img[alt="${username}"]`).should('be.visible');
  });
});