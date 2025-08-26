import {
  validateEmail,
  validateUsername,
  validatePassword,
  validateRegisterForm,
  validateGameForm
} from '../validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('validates correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
      expect(validateEmail('user123@test-domain.com')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('test.example.com')).toBe(false);
    });
  });

  describe('validateUsername', () => {
    it('validates correct usernames', () => {
      expect(validateUsername('user123')).toBe(true);
      expect(validateUsername('test_user')).toBe(true);
      expect(validateUsername('ValidUser')).toBe(true);
    });

    it('rejects invalid usernames', () => {
      expect(validateUsername('ab')).toBe(false); // too short
      expect(validateUsername('a'.repeat(21))).toBe(false); // too long
      expect(validateUsername('user-name')).toBe(false); // invalid character
      expect(validateUsername('user space')).toBe(false); // space not allowed
      expect(validateUsername('')).toBe(false); // empty
    });
  });

  describe('validatePassword', () => {
    it('validates passwords with correct length', () => {
      expect(validatePassword('Password123!')).toBe(true);
      expect(validatePassword('MyStr0ngP@ss')).toBe(true);
      expect(validatePassword('simplepass')).toBe(true);
      expect(validatePassword('12345678')).toBe(true);
    });

    it('rejects short passwords', () => {
      expect(validatePassword('weak')).toBe(false); // too short
      expect(validatePassword('1234567')).toBe(false); // too short
      expect(validatePassword('')).toBe(false); // empty
    });
  });

  describe('validateRegisterForm', () => {
    const validForm = {
      username: 'testuser',
      email: 'test@example.com',
      displayName: 'Test User',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    };

    it('validates correct registration form', () => {
      const errors = validateRegisterForm(validForm);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it('validates username requirements', () => {
      const invalidForm = { ...validForm, username: 'ab' };
      const errors = validateRegisterForm(invalidForm);
      expect(errors.username).toBeDefined();
    });

    it('validates email requirements', () => {
      const invalidForm = { ...validForm, email: 'invalid-email' };
      const errors = validateRegisterForm(invalidForm);
      expect(errors.email).toBeDefined();
    });

    it('validates display name requirements', () => {
      const invalidForm = { ...validForm, displayName: '' };
      const errors = validateRegisterForm(invalidForm);
      expect(errors.displayName).toBeDefined();
    });

    it('validates password requirements', () => {
      const invalidForm = { ...validForm, password: 'weak' };
      const errors = validateRegisterForm(invalidForm);
      expect(errors.password).toBeDefined();
    });

    it('validates password confirmation', () => {
      const invalidForm = { ...validForm, confirmPassword: 'different' };
      const errors = validateRegisterForm(invalidForm);
      expect(errors.confirmPassword).toBeDefined();
    });
  });

  describe('validateGameForm', () => {
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // Tomorrow
    const validGame = {
      name: 'Test Game',
      sport: 'football' as const,
      homeTeam: 'Team A',
      awayTeam: 'Team B',
      gameDate: futureDate,
      description: 'Test game description',
      payoutStructure: {
        firstQuarter: 25,
        secondQuarter: 25,
        thirdQuarter: 25,
        finalScore: 25
      }
    };

    it('validates correct game form', () => {
      const errors = validateGameForm(validGame);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it('requires game name', () => {
      const invalidGame = { ...validGame, name: '' };
      const errors = validateGameForm(invalidGame);
      expect(errors.name).toBeDefined();
    });

    it('requires valid teams', () => {
      const invalidGame = { ...validGame, homeTeam: '', awayTeam: '' };
      const errors = validateGameForm(invalidGame);
      expect(errors.homeTeam).toBeDefined();
      expect(errors.awayTeam).toBeDefined();
    });

    it('validates payout structure totals 100%', () => {
      const invalidGame = {
        ...validGame,
        payoutStructure: {
          firstQuarter: 30,
          secondQuarter: 30,
          thirdQuarter: 30,
          finalScore: 30 // Total: 120%
        }
      };
      const errors = validateGameForm(invalidGame);
      expect(errors.payoutStructure).toBeDefined();
    });

    it('validates future game date', () => {
      const pastDate = new Date('2020-01-01T20:00:00').toISOString();
      const invalidGame = { ...validGame, gameDate: pastDate };
      const errors = validateGameForm(invalidGame);
      expect(errors.gameDate).toBeDefined();
    });
  });
});