// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to login as player
Cypress.Commands.add('loginAsPlayer', (email = Cypress.env('TEST_USER_EMAIL'), password = Cypress.env('TEST_USER_PASSWORD')) => {
  cy.visit('/login');
  cy.get('input[name="username"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

// Custom command to login as admin
Cypress.Commands.add('loginAsAdmin', (email = Cypress.env('TEST_ADMIN_EMAIL'), password = Cypress.env('TEST_ADMIN_PASSWORD')) => {
  cy.visit('/admin/login');
  cy.get('input[name="username"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/admin/dashboard');
});

// Custom command to register a new player
Cypress.Commands.add('registerPlayer', (username, email, displayName, password) => {
  cy.visit('/register');
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="displayName"]').type(displayName);
  cy.get('input[name="password"]').type(password);
  cy.get('input[name="confirmPassword"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

// Custom command to logout
Cypress.Commands.add('logout', () => {
  cy.get('button').contains('Logout').click();
  cy.url().should('eq', Cypress.config().baseUrl + '/');
});

// Custom command to create a test game (admin only)
Cypress.Commands.add('createTestGame', (gameData) => {
  const defaultGameData = {
    name: 'Test Game',
    sport: 'football',
    homeTeam: 'Home Team',
    awayTeam: 'Away Team',
    gameDate: '2024-12-31T20:00',
    payoutStructure: {
      firstQuarter: 25,
      secondQuarter: 25,
      thirdQuarter: 25,
      finalScore: 25
    }
  };

  const game = { ...defaultGameData, ...gameData };

  cy.visit('/admin/games/new');
  
  // Fill out the form
  cy.get('input[name="name"]').type(game.name);
  cy.get('select[name="sport"]').select(game.sport);
  cy.get('input[name="homeTeam"]').type(game.homeTeam);
  cy.get('input[name="awayTeam"]').type(game.awayTeam);
  cy.get('input[name="gameDate"]').type(game.gameDate);
  
  // Set payout structure
  cy.get('input[name="payout_firstQuarter"]').clear().type(game.payoutStructure.firstQuarter.toString());
  cy.get('input[name="payout_secondQuarter"]').clear().type(game.payoutStructure.secondQuarter.toString());
  cy.get('input[name="payout_thirdQuarter"]').clear().type(game.payoutStructure.thirdQuarter.toString());
  cy.get('input[name="payout_finalScore"]').clear().type(game.payoutStructure.finalScore.toString());
  
  // Submit form
  cy.get('button[type="submit"]').click();
  
  // Should redirect to admin games list or game details
  cy.url().should('include', '/admin/games');
});

// Custom command to request a square
Cypress.Commands.add('requestSquare', (row, col) => {
  cy.get(`[data-testid="square-${row}-${col}"]`).click();
  cy.get('button').contains('Request This Square').click();
});

// Custom command for accessibility testing
Cypress.Commands.add('checkA11y', (options = {}) => {
  cy.injectAxe();
  cy.checkA11y(undefined, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa']
    }
  }, options.callback);
});

// Custom command to check responsive design
Cypress.Commands.add('checkResponsive', (selector) => {
  // Check mobile
  cy.viewport('iphone-x');
  if (selector) cy.get(selector).should('be.visible');
  
  // Check tablet
  cy.viewport('ipad-2');
  if (selector) cy.get(selector).should('be.visible');
  
  // Check desktop
  cy.viewport(1280, 720);
  if (selector) cy.get(selector).should('be.visible');
});

// Custom command to wait for API calls to complete
Cypress.Commands.add('waitForApi', () => {
  cy.intercept('GET', '/api/**').as('getApi');
  cy.intercept('POST', '/api/**').as('postApi');
  cy.intercept('PUT', '/api/**').as('putApi');
  cy.intercept('DELETE', '/api/**').as('deleteApi');
});

// Custom command to mock API responses
Cypress.Commands.add('mockApiResponse', (method, url, response, status = 200) => {
  cy.intercept(method, url, {
    statusCode: status,
    body: response
  });
});

// Custom Cypress commands defined above
// Type definitions can be found in cypress/support/index.d.ts