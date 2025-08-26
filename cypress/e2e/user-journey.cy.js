describe('BV Squares - Complete User Journey', () => {
  const testUser = {
    username: 'testplayer',
    email: 'test@example.com',
    displayName: 'Test Player',
    password: 'testpassword123'
  };

  beforeEach(() => {
    // Set up API interceptors
    cy.waitForApi();
  });

  describe('Player Registration and Game Participation', () => {
    it('should complete the full player journey from registration to square request', () => {
      // Step 1: Visit homepage
      cy.visit('/');
      cy.get('h1').should('contain', 'BV Squares');
      cy.get('button').contains('Get Started').should('be.visible');

      // Step 2: Navigate to registration
      cy.get('button').contains('Get Started').click();
      cy.url().should('include', '/register');

      // Step 3: Register new player account
      cy.get('input[name="username"]').type(testUser.username);
      cy.get('input[name="email"]').type(testUser.email);
      cy.get('input[name="displayName"]').type(testUser.displayName);
      cy.get('input[name="password"]').type(testUser.password);
      cy.get('input[name="confirmPassword"]').type(testUser.password);
      
      cy.get('button[type="submit"]').click();

      // Should redirect to dashboard after successful registration
      cy.url().should('include', '/dashboard');
      cy.get('h1').should('contain', 'Dashboard');

      // Step 4: Browse available games
      cy.visit('/games');
      cy.get('h1').should('contain', 'Games');
      
      // Should see games or "no games" message
      cy.get('body').should('contain.oneOf', ['No games available', 'Game']);

      // Step 5: If there are games, try to view one
      cy.get('body').then($body => {
        if ($body.find('[data-testid="game-card"]').length > 0) {
          // Click on first game
          cy.get('[data-testid="game-card"]').first().click();
          
          // Should navigate to game details
          cy.url().should('include', '/games/');
          
          // Should see the game grid
          cy.get('[data-testid="game-grid"]').should('be.visible');
          
          // Try to request a square (if available)
          cy.get('[data-testid^="square-"]').then($squares => {
            if ($squares.length > 0) {
              cy.wrap($squares.first()).click();
              // Modal should open
              cy.get('[role="dialog"]').should('be.visible');
              cy.get('h3').should('contain', 'Square Details');
            }
          });
        }
      });

      // Step 6: Check player dashboard
      cy.visit('/dashboard');
      cy.get('h1').should('contain', 'Dashboard');
      
      // Should show user's squares/requests
      cy.get('body').should('contain.oneOf', [
        'No squares requested',
        'My Squares',
        'Pending Requests'
      ]);

      // Step 7: Logout
      cy.get('button').contains('Logout').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('should handle login flow for existing users', () => {
      // Assume user already exists, test login
      cy.visit('/login');
      
      // Fill login form
      cy.get('input[name="username"]').type(testUser.email);
      cy.get('input[name="password"]').type(testUser.password);
      cy.get('button[type="submit"]').click();

      // Should redirect to dashboard
      cy.url().should('include', '/dashboard');
      cy.get('h1').should('contain', 'Dashboard');
    });
  });

  describe('Admin Journey', () => {
    it('should handle admin login and game management', () => {
      // Step 1: Admin login
      cy.visit('/admin/login');
      cy.get('h1').should('contain', 'Admin Access');

      // Mock admin credentials
      cy.get('input[name="username"]').type('admin@example.com');
      cy.get('input[name="password"]').type('adminpassword');
      cy.get('button[type="submit"]').click();

      // Should redirect to admin dashboard
      cy.url().should('include', '/admin/dashboard');
      cy.get('h1').should('contain', 'Admin Dashboard');

      // Step 2: Navigate to game management
      cy.visit('/admin/games');
      cy.get('h1').should('contain', 'Manage Games');

      // Step 3: Try to create a new game
      cy.get('button').contains('New Game').click();
      cy.url().should('include', '/admin/games/new');

      // Fill out game creation form
      cy.get('input[name="name"]').type('Test Football Game');
      cy.get('select[name="sport"]').select('football');
      cy.get('input[name="homeTeam"]').type('Team A');
      cy.get('input[name="awayTeam"]').type('Team B');
      cy.get('input[name="gameDate"]').type('2024-12-31T20:00');

      // Verify payout structure totals 100%
      cy.get('input[name="payout_firstQuarter"]').should('have.value', '25');
      cy.get('input[name="payout_secondQuarter"]').should('have.value', '25');
      cy.get('input[name="payout_thirdQuarter"]').should('have.value', '25');
      cy.get('input[name="payout_finalScore"]').should('have.value', '25');

      // Submit form
      cy.get('button[type="submit"]').should('not.be.disabled');
      cy.get('button[type="submit"]').click();

      // Should redirect back to games list
      cy.url().should('include', '/admin/games');

      // Step 4: Check requests management
      cy.visit('/admin/requests');
      cy.get('h1').should('contain', 'Square Requests');
      
      // Should show requests or "no requests" message
      cy.get('body').should('contain.oneOf', [
        'No pending requests',
        'Pending'
      ]);
    });
  });

  describe('Game Interaction Flow', () => {
    it('should handle square request and approval workflow', () => {
      // This test would require both player and admin interactions
      // In a real scenario, you'd set up test data or use API mocking
      
      cy.visit('/games');
      
      // Mock a game with available squares
      cy.mockApiResponse('GET', '/api/games*', {
        success: true,
        data: {
          items: [
            {
              id: 'test-game-1',
              name: 'Test Game',
              sport: 'football',
              homeTeam: 'Team A',
              awayTeam: 'Team B',
              status: 'setup',
              gameDate: '2024-12-31T20:00:00Z',
              payoutStructure: {
                firstQuarter: 25,
                secondQuarter: 25,
                thirdQuarter: 25,
                finalScore: 25
              },
              scores: {}
            }
          ],
          count: 1
        }
      });

      // Mock squares data
      cy.mockApiResponse('GET', '/api/games/*/squares', {
        success: true,
        data: Array.from({ length: 100 }, (_, i) => ({
          id: `square-${i}`,
          gameId: 'test-game-1',
          row: Math.floor(i / 10),
          col: i % 10,
          status: 'available'
        }))
      });

      cy.reload();
      
      // Should show the mocked game
      cy.get('[data-testid="game-card"]').should('contain', 'Test Game');
      
      // Click to view game details
      cy.get('[data-testid="game-card"]').click();
      cy.url().should('include', '/games/test-game-1');
    });
  });

  describe('Responsive Design', () => {
    it('should work correctly on mobile devices', () => {
      // Test mobile viewport
      cy.viewport('iphone-x');
      
      cy.visit('/');
      cy.get('h1').should('be.visible');
      
      // Check mobile navigation
      cy.get('[aria-label="Toggle mobile menu"]').should('be.visible');
      cy.get('[aria-label="Toggle mobile menu"]').click();
      
      // Mobile menu should be visible
      cy.get('nav').should('contain', 'Home');
      
      // Test registration form on mobile
      cy.visit('/register');
      cy.get('input[name="username"]').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      
      // Test game grid on mobile
      cy.visit('/games');
      cy.checkResponsive('[data-testid="game-card"]');
    });

    it('should work correctly on tablet', () => {
      cy.viewport('ipad-2');
      
      cy.visit('/');
      cy.get('h1').should('be.visible');
      
      // Navigation should be visible on tablet
      cy.get('nav a').should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should meet WCAG AA standards', () => {
      // Test homepage accessibility
      cy.visit('/');
      cy.checkA11y();

      // Test registration form accessibility
      cy.visit('/register');
      cy.checkA11y();

      // Test login form accessibility
      cy.visit('/login');
      cy.checkA11y();

      // Test games list accessibility
      cy.visit('/games');
      cy.checkA11y();
    });

    it('should support keyboard navigation', () => {
      cy.visit('/');
      
      // Tab through main navigation
      cy.get('body').tab();
      cy.focused().should('contain', 'Home');
      
      cy.focused().tab();
      cy.focused().should('contain', 'Games');
      
      // Test form keyboard navigation
      cy.visit('/register');
      cy.get('input[name="username"]').focus().tab();
      cy.focused().should('have.attr', 'name', 'email');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      // Mock network failure
      cy.intercept('GET', '/api/**', { forceNetworkError: true });
      
      cy.visit('/games');
      
      // Should show error message
      cy.get('body').should('contain.oneOf', [
        'Error loading',
        'Network error',
        'Failed to load'
      ]);
    });

    it('should validate form inputs', () => {
      cy.visit('/register');
      
      // Try to submit empty form
      cy.get('button[type="submit"]').click();
      
      // Should show validation errors
      cy.get('[role="alert"]').should('be.visible');
      
      // Test invalid email
      cy.get('input[name="email"]').type('invalid-email');
      cy.get('input[name="username"]').type('test');
      cy.get('button[type="submit"]').click();
      
      cy.get('body').should('contain', 'email');
    });
  });
});