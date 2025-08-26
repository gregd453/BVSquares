import React, { useState } from 'react';
import Modal, { ConfirmModal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Square, Game, User } from '@/types';
import { formatSquarePosition, formatTimeAgo } from '@/utils/formatters';

interface SquareModalProps {
  isOpen: boolean;
  onClose: () => void;
  square: Square;
  game: Game;
  currentUser: User;
  onRequestSquare: (square: Square) => Promise<void>;
  onCancelRequest: (square: Square) => Promise<void>;
}

const SquareModal: React.FC<SquareModalProps> = ({
  isOpen,
  onClose,
  square,
  game,
  currentUser,
  onRequestSquare,
  onCancelRequest
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const isOwner = square.playerId === currentUser.id;
  const canRequest = game.status === 'setup' && square.status === 'available';
  const canCancel = game.status === 'setup' && square.status === 'requested' && isOwner;

  const handleRequestSquare = async () => {
    setIsLoading(true);
    try {
      await onRequestSquare(square);
      onClose();
    } catch (error) {
      console.error('Failed to request square:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    setIsLoading(true);
    try {
      await onCancelRequest(square);
      setShowCancelConfirm(false);
      onClose();
    } catch (error) {
      console.error('Failed to cancel request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: Square['status']): string => {
    switch (status) {
      case 'available':
        return 'text-neutral-600';
      case 'requested':
        return 'text-warning';
      case 'approved':
        return 'text-success';
      default:
        return 'text-neutral-600';
    }
  };

  const getStatusText = (status: Square['status']): string => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'requested':
        return 'Pending Approval';
      case 'approved':
        return 'Approved';
      default:
        return 'Unknown';
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Square Details"
        size="md"
      >
        <div className="space-y-4">
          {/* Square Information */}
          <div className="bg-neutral-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Position
                </label>
                <p className="mt-1 text-neutral-900">
                  {formatSquarePosition(square.row, square.col)}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Status
                </label>
                <p className={`mt-1 font-medium ${getStatusColor(square.status)}`}>
                  {getStatusText(square.status)}
                </p>
              </div>

              {game.rowNumbers && game.colNumbers && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700">
                      {game.homeTeam} Number
                    </label>
                    <p className="mt-1 text-2xl font-bold text-secondary-600">
                      {game.rowNumbers[square.row]}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700">
                      {game.awayTeam} Number
                    </label>
                    <p className="mt-1 text-2xl font-bold text-primary-600">
                      {game.colNumbers[square.col]}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Player Information */}
          {square.playerDisplayName && (
            <div className="border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    Player
                  </label>
                  <p className="mt-1 text-lg font-semibold text-neutral-900">
                    {square.playerDisplayName}
                    {isOwner && (
                      <span className="ml-2 text-sm text-secondary-600 font-normal">
                        (You)
                      </span>
                    )}
                  </p>
                </div>
                
                {square.status === 'approved' && (
                  <div className="flex items-center space-x-2 text-success">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Approved</span>
                  </div>
                )}
              </div>

              {square.requestedAt && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-neutral-700">
                    {square.status === 'requested' ? 'Requested' : 'Originally Requested'}
                  </label>
                  <p className="mt-1 text-sm text-neutral-600">
                    {formatTimeAgo(square.requestedAt)}
                  </p>
                </div>
              )}

              {square.approvedAt && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-neutral-700">
                    Approved
                  </label>
                  <p className="mt-1 text-sm text-neutral-600">
                    {formatTimeAgo(square.approvedAt)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Game Information */}
          <div className="border-t border-neutral-200 pt-4">
            <h4 className="text-sm font-medium text-neutral-700 mb-2">
              Game: {game.name}
            </h4>
            <p className="text-sm text-neutral-600">
              {game.homeTeam} vs {game.awayTeam}
            </p>
            
            {game.status === 'setup' && !game.rowNumbers && (
              <p className="text-sm text-neutral-500 mt-2">
                Numbers will be randomly assigned when the game goes live.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            {canRequest && (
              <Button
                variant="primary"
                onClick={handleRequestSquare}
                isLoading={isLoading}
                disabled={isLoading}
              >
                Request This Square
              </Button>
            )}

            {canCancel && (
              <Button
                variant="danger"
                onClick={() => setShowCancelConfirm(true)}
                disabled={isLoading}
              >
                Cancel Request
              </Button>
            )}

            <Button
              variant="tertiary"
              onClick={onClose}
              disabled={isLoading}
            >
              Close
            </Button>
          </div>

          {/* Informational Messages */}
          {square.status === 'available' && game.status !== 'setup' && (
            <div className="bg-neutral-100 rounded-md p-3">
              <p className="text-sm text-neutral-600">
                This square is no longer available for requests as the game has started.
              </p>
            </div>
          )}

          {square.status === 'requested' && !isOwner && (
            <div className="bg-warning/10 rounded-md p-3">
              <p className="text-sm text-warning-dark">
                This square has been requested by {square.playerDisplayName} and is awaiting admin approval.
              </p>
            </div>
          )}

          {square.status === 'approved' && !isOwner && (
            <div className="bg-success/10 rounded-md p-3">
              <p className="text-sm text-success-dark">
                This square is owned by {square.playerDisplayName}.
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={handleCancelRequest}
        title="Cancel Square Request"
        message="Are you sure you want to cancel your request for this square? You can request it again later if it's still available."
        confirmText="Cancel Request"
        cancelText="Keep Request"
        variant="danger"
        isLoading={isLoading}
      />
    </>
  );
};

export default SquareModal;