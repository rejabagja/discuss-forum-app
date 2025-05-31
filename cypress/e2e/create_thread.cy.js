/*
create thread spec:
- should display create thread page correctly
- should shown error message when title field is empty
- should shown error message when body field is empty
- should show teks 'Creating...' on submit button when create thread is processing
- should redirect to home page when create thread success
*/

describe('Create Thread Spec', () => {
  beforeEach(() => {
    cy.session('login-session', () => {
      cy.login('testy@mail.com', '123456');
    });
    cy.visit('/');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('theme')).to.exist;
      expect(win.localStorage.getItem('token')).to.exist;
    });
    cy.get('img[alt="testuser2"]').should('be.visible');
    cy.get('a[href="/create"]').should('exist').click();
    cy.location('pathname').should('eq', '/create');
  });

  it('should display create thread page correctly', () => {
    cy.contains('h2', 'Create New Thread').should('be.visible');
    cy.get('input[placeholder="Title"]').should('be.visible');
    cy.get('input[placeholder="Category"]').should('be.visible');
    cy.contains('Write your thread body here...').should('be.visible');
    cy.get('div[contenteditable="true"]').should('be.visible');
    cy.contains('button[type="button"]', /^Create$/).should('be.visible');
  });

  it('should shown error message when title field is empty', () => {
    cy.get('div[contenteditable="true"]').type('test body');
    cy.contains('button[type="button"]', /^Create$/).click();

    cy.contains('p.text-red-500', '"title" is not allowed to be empty').should('be.visible');
  });

  it('should shown error message when body field is empty', () => {
    cy.get('input[placeholder="Title"]').type('test title');
    cy.contains('button[type="button"]', /^Create$/).click();

    cy.contains('p.text-red-500', '"body" is not allowed to be empty').should('be.visible');
  });

  it('should show teks "Creating..." on submit button when create thread is processing', () => {
    // create thread req intercept
    cy.intercept('POST', 'https://forum-api.dicoding.dev/v1/threads', (req) => {
      req.on('response', (res) => {
        res.setDelay(3000);
      });
    }).as('createThreadRequest');

    cy.get('input[placeholder="Title"]').type('test title');
    cy.contains('button[type="button"]', /^Create$/).click();

    cy.contains('button[type="button"]', /^Creating...$/).should('be.visible');

    cy.wait('@createThreadRequest');

    cy.contains(/^Creating...$/).should('not.exist');
  });

  it('should redirect to home page when create thread success', () => {
    cy.get('input[placeholder="Title"]').type('test title');
    cy.get('input[placeholder="Category"]').type('test category');
    cy.get('div[contenteditable="true"]').type('test body');
    cy.contains('button[type="button"]', /^Create$/).click();
    cy.location('pathname').should('eq', '/');
  });
});