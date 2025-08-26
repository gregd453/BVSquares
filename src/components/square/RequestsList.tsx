import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import BaseCard from '@/components/ui/BaseCard';
import { ConfirmModal } from '@/components/ui/Modal';
import { SquareRequest, Game } from '@/types';
import { formatSquarePosition, formatTimeAgo } from '@/utils/formatters';

interface RequestsListProps {
  requests: SquareRequest[];
  games?: Game[];
  onApprove: (requestId: string) => Promise<void>;
  onReject: (requestId: string, reason?: string) => Promise<void>;
  isLoading?: boolean;
  showGameNames?: boolean;
}

const RequestsList: React.FC<RequestsListProps> = ({
  requests,
  games = [],
  onApprove,
  onReject,
  isLoading = false,
  showGameNames = true
}) => {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{
    isOpen: boolean;
    requestId: string;
    playerName: string;
  }>({
    isOpen: false,
    requestId: '',
    playerName: ''
  });
  const [rejectionReason, setRejectionReason] = useState('');

  const gameMap = games.reduce((map, game) => {
    map[game.id] = game;
    return map;
  }, {} as Record<string, Game>);

  const handleApprove = async (request: SquareRequest) => {
    setProcessingId(request.id);
    try {
      await onApprove(request.id);
    } catch (error) {
      console.error('Failed to approve request:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string, reason?: string) => {
    setProcessingId(requestId);
    try {
      await onReject(requestId, reason);
      setRejectModal({ isOpen: false, requestId: '', playerName: '' });
      setRejectionReason('');
    } catch (error) {
      console.error('Failed to reject request:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectModal = (request: SquareRequest) => {
    setRejectModal({
      isOpen: true,
      requestId: request.id,
      playerName: request.playerDisplayName
    });
  };

  if (requests.length === 0) {
    return (
      <BaseCard>
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-neutral-900">No pending requests</h3>
          <p className="mt-1 text-sm text-neutral-500">
            There are no square requests waiting for approval.
          </p>
        </div>
      </BaseCard>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {requests.map((request) => {
          const game = gameMap[request.gameId];
          const isProcessing = processingId === request.id;
          
          return (
            <BaseCard key={request.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium text-sm">
                          {request.playerDisplayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {request.playerDisplayName}
                        </p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning/20 text-warning-dark">
                          Pending
                        </span>
                      </div>
                      
                      <div className="mt-1 flex items-center space-x-4 text-sm text-neutral-500">
                        <span>{formatSquarePosition(request.row, request.col)}</span>
                        
                        {showGameNames && game && (
                          <>
                            <span>•</span>
                            <span className="truncate">{game.name}</span>
                          </>
                        )}
                        
                        <span>•</span>
                        <span>{formatTimeAgo(request.requestedAt)}</span>
                      </div>

                      {game && game.rowNumbers && game.colNumbers && (
                        <div className="mt-2 flex items-center space-x-4">
                          <div className="text-xs">
                            <span className="text-neutral-600">Numbers: </span>
                            <span className="font-medium text-secondary-600">
                              {game.rowNumbers[request.row]}
                            </span>
                            <span className="text-neutral-400"> × </span>
                            <span className="font-medium text-primary-600">
                              {game.colNumbers[request.col]}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApprove(request)}
                    isLoading={isProcessing}
                    disabled={isLoading || isProcessing}
                  >
                    Approve
                  </Button>
                  
                  <Button
                    variant="tertiary"
                    size="sm"
                    onClick={() => openRejectModal(request)}
                    disabled={isLoading || isProcessing}
                  >
                    Reject
                  </Button>
                </div>
              </div>

              {game && (
                <div className="mt-3 pt-3 border-t border-neutral-100">
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>{game.homeTeam} vs {game.awayTeam}</span>
                    <span className={`px-2 py-1 rounded-full ${
                      game.status === 'setup' ? 'bg-neutral-100' :
                      game.status === 'active' ? 'bg-success/20 text-success' :
                      'bg-neutral-400/20'
                    }`}>
                      {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
                    </span>
                  </div>
                </div>
              )}
            </BaseCard>
          );
        })}
      </div>

      {/* Reject Confirmation Modal */}
      <ConfirmModal
        isOpen={rejectModal.isOpen}
        onClose={() => {
          setRejectModal({ isOpen: false, requestId: '', playerName: '' });
          setRejectionReason('');
        }}
        onConfirm={() => handleReject(rejectModal.requestId, rejectionReason)}
        title="Reject Square Request"
        message={
          <div className="space-y-3">
            <p>
              Are you sure you want to reject {rejectModal.playerName}'s request for this square?
            </p>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Rejection Reason (Optional):
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this request is being rejected..."
                className="form-textarea w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                rows={3}
              />
            </div>
          </div>
        }
        confirmText="Reject Request"
        cancelText="Cancel"
        variant="danger"
        isLoading={processingId === rejectModal.requestId}
      />
    </>
  );
};

export default RequestsList;