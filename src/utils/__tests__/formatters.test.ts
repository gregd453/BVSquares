import {
  formatSquarePosition,
  formatTimeAgo,
  formatApiError,
  formatGameStatus,
  formatDate,
  formatPayout,
  formatScore,
  getLastDigit
} from '../formatters';

// Mock Date for consistent testing
const mockDate = new Date('2024-01-01T12:00:00Z');
jest.useFakeTimers();
jest.setSystemTime(mockDate);

describe('Formatter Utils', () => {
  describe('formatSquarePosition', () => {
    it('formats square positions correctly', () => {
      expect(formatSquarePosition(0, 0)).toBe('Row 0, Col 0');
      expect(formatSquarePosition(0, 9)).toBe('Row 0, Col 9');
      expect(formatSquarePosition(9, 0)).toBe('Row 9, Col 0');
      expect(formatSquarePosition(9, 9)).toBe('Row 9, Col 9');
      expect(formatSquarePosition(4, 4)).toBe('Row 4, Col 4');
    });

    it('handles edge cases', () => {
      expect(formatSquarePosition(-1, 0)).toBe('Row -1, Col 0');
      expect(formatSquarePosition(0, -1)).toBe('Row 0, Col -1');
      expect(formatSquarePosition(10, 10)).toBe('Row 10, Col 10');
    });
  });

  describe('formatTimeAgo', () => {
    it('formats time differences correctly', () => {
      // 1 minute ago
      const oneMinuteAgo = new Date(mockDate.getTime() - 60 * 1000).toISOString();
      expect(formatTimeAgo(oneMinuteAgo)).toBe('1 minute ago');

      // 30 minutes ago
      const thirtyMinutesAgo = new Date(mockDate.getTime() - 30 * 60 * 1000).toISOString();
      expect(formatTimeAgo(thirtyMinutesAgo)).toBe('30 minutes ago');

      // 2 hours ago
      const twoHoursAgo = new Date(mockDate.getTime() - 2 * 60 * 60 * 1000).toISOString();
      expect(formatTimeAgo(twoHoursAgo)).toBe('2 hours ago');

      // 3 days ago
      const threeDaysAgo = new Date(mockDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();
      expect(formatTimeAgo(threeDaysAgo)).toBe('3 days ago');
    });

    it('handles edge cases', () => {
      // Just now (less than 1 minute)
      const justNow = new Date(mockDate.getTime() - 30 * 1000).toISOString();
      expect(formatTimeAgo(justNow)).toBe('Just now');

      // Future date
      const futureDate = new Date(mockDate.getTime() + 60 * 1000).toISOString();
      expect(formatTimeAgo(futureDate)).toBe('Just now');
    });
  });

  describe('formatApiError', () => {
    it('formats error objects correctly', () => {
      const error = new Error('Network error');
      expect(formatApiError(error)).toBe('Network error');
    });

    it('formats error with message property', () => {
      const errorObj = { message: 'Something went wrong' };
      expect(formatApiError(errorObj)).toBe('Something went wrong');
    });

    it('handles string errors', () => {
      expect(formatApiError('Simple error message')).toBe('Simple error message');
    });

    it('handles unknown error types', () => {
      expect(formatApiError(null)).toBe('An unexpected error occurred');
      expect(formatApiError(undefined)).toBe('An unexpected error occurred');
      expect(formatApiError({})).toBe('An unexpected error occurred');
    });
  });

  describe('formatGameStatus', () => {
    it('formats game statuses correctly', () => {
      expect(formatGameStatus('setup')).toBe('Setup');
      expect(formatGameStatus('active')).toBe('Active');
      expect(formatGameStatus('completed')).toBe('Completed');
    });

    it('handles unknown statuses', () => {
      expect(formatGameStatus('unknown' as any)).toBe('Unknown');
    });
  });

  describe('formatScore', () => {
    it('formats scores correctly', () => {
      expect(formatScore(7)).toBe('7');
      expect(formatScore(14)).toBe('14');
      expect(formatScore(0)).toBe('0');
    });

    it('handles undefined scores', () => {
      expect(formatScore(undefined)).toBe('-');
    });
  });

  describe('getLastDigit', () => {
    it('gets last digit correctly', () => {
      expect(getLastDigit(7)).toBe(7);
      expect(getLastDigit(14)).toBe(4);
      expect(getLastDigit(23)).toBe(3);
      expect(getLastDigit(0)).toBe(0);
    });
  });

  describe('formatPayout', () => {
    it('formats payout percentages correctly', () => {
      expect(formatPayout(100)).toBe('100%');
      expect(formatPayout(25.5)).toBe('25.5%');
      expect(formatPayout(0)).toBe('0%');
    });
  });

  describe('formatDate', () => {
    it('formats dates correctly', () => {
      const testDate = '2024-01-01T20:00:00Z';
      const formatted = formatDate(testDate);
      expect(formatted).toContain('Jan');
      expect(formatted).toContain('2024');
    });
  });
});

afterAll(() => {
  jest.useRealTimers();
});