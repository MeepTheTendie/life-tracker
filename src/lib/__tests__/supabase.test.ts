import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getLocalUserId } from '../supabase';

describe('Life Tracker Utilities', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should return empty string on server-side', () => {
    vi.stubGlobal('window', undefined);
    const result = getLocalUserId();
    expect(result).toBe('');
  });

  it('should return existing userId from localStorage', () => {
    const mockUserId = 'existing_user_456';
    localStorage.getItem = vi.fn().mockReturnValue(mockUserId);

    const result = getLocalUserId();

    expect(result).toBe(mockUserId);
    expect(localStorage.getItem).toHaveBeenCalledWith('life_tracker_user_id');
  });

  it('should generate and store new userId when not in localStorage', () => {
    localStorage.getItem = vi.fn().mockReturnValue(null);
    vi.spyOn(Math, 'random').mockReturnValue(0.987654321);

    const result = getLocalUserId();

    expect(result).toMatch(/^user_/);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'life_tracker_user_id',
      expect.stringMatching(/^user_/)
    );
  });

  it('should generate unique userIds for different random values', () => {
    localStorage.getItem = vi.fn().mockReturnValue(null);
    vi.spyOn(Math, 'random').mockReturnValue(0.111111111);

    const result1 = getLocalUserId();
    vi.restoreAllMocks();
    
    localStorage.getItem = vi.fn().mockReturnValue(null);
    vi.spyOn(Math, 'random').mockReturnValue(0.222222222);
    
    const result2 = getLocalUserId();

    expect(result1).not.toBe(result2);
  });
});
