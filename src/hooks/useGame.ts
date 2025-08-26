import { useState, useCallback } from 'react';
import { Game, Square, SquareRequest, GameForm, ScoreUpdateForm } from '@/types';
import { useApi, useApiMutation } from './useApi';
import apiClient from '@/utils/apiClient';

// Get stored auth token
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('bv_squares_token');
  }
  return null;
};

// Hook for managing a single game
export function useGame(gameId: string) {
  const token = getToken();

  // Fetch game data
  const {
    data: game,
    isLoading: isLoadingGame,
    error: gameError,
    refetch: refetchGame
  } = useApi<Game>(
    () => apiClient.getGame(gameId),
    { immediate: !!gameId }
  );

  // Fetch game squares
  const {
    data: squares,
    isLoading: isLoadingSquares,
    error: squaresError,
    refetch: refetchSquares
  } = useApi<Square[]>(
    () => apiClient.getGameSquares(gameId),
    { immediate: !!gameId }
  );

  // Request square mutation
  const {
    mutate: requestSquare,
    isLoading: isRequestingSquare,
    error: requestError
  } = useApiMutation<Square, { row: number; col: number }>(
    (variables) => {
      if (!token) throw new Error('Authentication required');
      return apiClient.requestSquare(gameId, variables.row, variables.col, token);
    }
  );

  // Cancel square request mutation
  const {
    mutate: cancelSquareRequest,
    isLoading: isCancellingRequest,
    error: cancelError
  } = useApiMutation<{}, string>(
    (squareId) => {
      if (!token) throw new Error('Authentication required');
      return apiClient.cancelSquareRequest(gameId, squareId, token);
    }
  );

  // Combined loading state
  const isLoading = isLoadingGame || isLoadingSquares;
  const error = gameError || squaresError || requestError || cancelError;

  // Helper to refresh all data
  const refetch = useCallback(async () => {
    await Promise.all([refetchGame(), refetchSquares()]);
  }, [refetchGame, refetchSquares]);

  // Helper to handle square requests with refresh
  const handleSquareRequest = useCallback(async (square: Square) => {
    try {
      await requestSquare({ row: square.row, col: square.col });
      await refetch(); // Refresh data after successful request
    } catch (error) {
      throw error; // Re-throw for component handling
    }
  }, [requestSquare, refetch]);

  // Helper to handle square request cancellation with refresh
  const handleCancelRequest = useCallback(async (square: Square) => {
    try {
      await cancelSquareRequest(square.id);
      await refetch(); // Refresh data after successful cancellation
    } catch (error) {
      throw error; // Re-throw for component handling
    }
  }, [cancelSquareRequest, refetch]);

  return {
    game,
    squares: squares || [],
    isLoading,
    error,
    refetch,
    // Actions
    requestSquare: handleSquareRequest,
    cancelSquareRequest: handleCancelRequest,
    isRequestingSquare,
    isCancellingRequest
  };
}

// Hook for managing games list
export function useGamesList() {
  const [filters, setFilters] = useState<{
    status?: string;
    sport?: string;
  }>({});

  const {
    data: games,
    isLoading,
    error,
    refetch
  } = useApi<{ items: Game[]; count: number }>(
    () => apiClient.getGames(filters),
    { immediate: true }
  );

  const updateFilters = useCallback((newFilters: typeof filters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    games: games?.items || [],
    count: games?.count || 0,
    isLoading,
    error,
    refetch,
    filters,
    updateFilters
  };
}

// Hook for admin game management
export function useAdminGame(gameId?: string) {
  const token = getToken();

  // Create game mutation
  const {
    mutate: createGame,
    isLoading: isCreating,
    error: createError
  } = useApiMutation<Game, GameForm>(
    (gameData) => {
      if (!token) throw new Error('Authentication required');
      return apiClient.createGame(gameData, token);
    }
  );

  // Update game mutation
  const {
    mutate: updateGame,
    isLoading: isUpdating,
    error: updateError
  } = useApiMutation<Game, { id: string; data: Partial<GameForm> }>(
    ({ id, data }) => {
      if (!token) throw new Error('Authentication required');
      return apiClient.updateGame(id, data, token);
    }
  );

  // Assign numbers mutation
  const {
    mutate: assignNumbers,
    isLoading: isAssigningNumbers,
    error: assignError
  } = useApiMutation<Game, string>(
    (id) => {
      if (!token) throw new Error('Authentication required');
      return apiClient.assignNumbers(id, token);
    }
  );

  // Update game status mutation
  const {
    mutate: updateGameStatus,
    isLoading: isUpdatingStatus,
    error: statusError
  } = useApiMutation<Game, { id: string; status: string }>(
    ({ id, status }) => {
      if (!token) throw new Error('Authentication required');
      return apiClient.updateGameStatus(id, status, token);
    }
  );

  // Update game scores mutation
  const {
    mutate: updateGameScores,
    isLoading: isUpdatingScores,
    error: scoresError
  } = useApiMutation<Game, { id: string; scores: ScoreUpdateForm }>(
    ({ id, scores }) => {
      if (!token) throw new Error('Authentication required');
      return apiClient.updateGameScores(id, scores, token);
    }
  );

  // Remove square from player mutation
  const {
    mutate: removeSquare,
    isLoading: isRemovingSquare,
    error: removeError
  } = useApiMutation<{}, { gameId: string; squareId: string }>(
    ({ gameId, squareId }) => {
      if (!token) throw new Error('Authentication required');
      return apiClient.removeSquareFromPlayer(gameId, squareId, token);
    }
  );

  const isLoading = isCreating || isUpdating || isAssigningNumbers || isUpdatingStatus || isUpdatingScores || isRemovingSquare;
  const error = createError || updateError || assignError || statusError || scoresError || removeError;

  return {
    // Mutations
    createGame,
    updateGame: (data: Partial<GameForm>) => gameId ? updateGame({ id: gameId, data }) : null,
    assignNumbers: () => gameId ? assignNumbers(gameId) : null,
    updateGameStatus: (status: string) => gameId ? updateGameStatus({ id: gameId, status }) : null,
    updateGameScores: (scores: ScoreUpdateForm) => gameId ? updateGameScores({ id: gameId, scores }) : null,
    removeSquare: (squareId: string) => gameId ? removeSquare({ gameId, squareId }) : null,
    
    // State
    isLoading,
    error
  };
}

// Hook for square requests management
export function useSquareRequests(gameId?: string) {
  const token = getToken();

  // Fetch square requests
  const {
    data: requests,
    isLoading: isLoadingRequests,
    error: requestsError,
    refetch: refetchRequests
  } = useApi<SquareRequest[]>(
    () => {
      if (!token) throw new Error('Authentication required');
      return apiClient.getSquareRequests(gameId, token);
    },
    { immediate: !!token }
  );

  // Approve request mutation
  const {
    mutate: approveRequest,
    isLoading: isApprovingRequest,
    error: approveError
  } = useApiMutation<SquareRequest, string>(
    (requestId) => {
      if (!token) throw new Error('Authentication required');
      return apiClient.approveSquareRequest(requestId, token);
    }
  );

  // Reject request mutation
  const {
    mutate: rejectRequest,
    isLoading: isRejectingRequest,
    error: rejectError
  } = useApiMutation<{}, { requestId: string; reason?: string }>(
    ({ requestId, reason }) => {
      if (!token) throw new Error('Authentication required');
      return apiClient.rejectSquareRequest(requestId, reason || '', token);
    }
  );

  // Helper to handle approval with refresh
  const handleApproval = useCallback(async (requestId: string) => {
    try {
      await approveRequest(requestId);
      await refetchRequests(); // Refresh requests after approval
    } catch (error) {
      throw error;
    }
  }, [approveRequest, refetchRequests]);

  // Helper to handle rejection with refresh
  const handleRejection = useCallback(async (requestId: string, reason?: string) => {
    try {
      await rejectRequest({ requestId, reason });
      await refetchRequests(); // Refresh requests after rejection
    } catch (error) {
      throw error;
    }
  }, [rejectRequest, refetchRequests]);

  const isLoading = isLoadingRequests || isApprovingRequest || isRejectingRequest;
  const error = requestsError || approveError || rejectError;

  return {
    requests: requests || [],
    isLoading,
    error,
    refetch: refetchRequests,
    approveRequest: handleApproval,
    rejectRequest: handleRejection
  };
}

export default useGame;