import React from 'react';
import { Square, GameStatus } from '@/types';
import { formatDisplayName } from '@/utils/formatters';

interface SquareCellProps {
  square: Square;
  gameStatus: GameStatus;
  isLoggedIn: boolean;
  currentUserId?: string;
  onSquareClick: (square: Square) => void;
  rowNumber?: number;
  colNumber?: number;
}

const SquareCell: React.FC<SquareCellProps> = ({
  square,
  gameStatus,
  isLoggedIn,
  currentUserId,
  onSquareClick,
  rowNumber,
  colNumber
}) => {
  const isOwner = square.playerId === currentUserId;
  const canInteract = isLoggedIn && gameStatus === 'setup';
  const canClick = canInteract && (square.status === 'available' || (square.status === 'requested' && isOwner));

  const getBackgroundColor = (): string => {
    switch (square.status) {
      case 'available':
        return canInteract 
          ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 hover:border-neutral-300' 
          : 'bg-neutral-50 border-neutral-200';
      case 'requested':
        if (isOwner) {
          return 'bg-warning/20 border-warning text-warning-dark hover:bg-warning/30';
        }
        return 'bg-warning/10 border-warning text-warning-dark';
      case 'approved':
        if (isOwner) {
          return 'bg-primary-200 border-primary-600 text-primary-900';
        }
        return 'bg-primary-100 border-primary-500 text-primary-900';
      default:
        return 'bg-neutral-50 border-neutral-200';
    }
  };

  const getTextContent = (): string => {
    if (square.playerDisplayName) {
      return formatDisplayName(square.playerDisplayName);
    }
    if (rowNumber !== undefined && colNumber !== undefined) {
      return `${colNumber}${rowNumber}`;
    }
    return '';
  };

  const getCursorClass = (): string => {
    if (canClick) {
      return 'cursor-pointer';
    }
    if (square.status !== 'available') {
      return 'cursor-default';
    }
    return 'cursor-not-allowed';
  };

  const handleClick = () => {
    if (canClick) {
      onSquareClick(square);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (canClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onSquareClick(square);
    }
  };

  return (
    <div
      className={`
        relative w-12 h-12 sm:w-16 sm:h-16 border-2 rounded-md transition-all duration-200
        ${getBackgroundColor()}
        ${getCursorClass()}
        ${canClick ? 'hover:shadow-md transform hover:scale-105' : ''}
        ${canClick ? 'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1' : ''}
      `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={canClick ? 0 : -1}
      role={canClick ? 'button' : undefined}
      aria-label={
        square.status === 'available' 
          ? `Available square at row ${square.row}, column ${square.col}${canClick ? ', click to request' : ''}` 
          : square.status === 'requested'
          ? `Square requested by ${square.playerDisplayName} at row ${square.row}, column ${square.col}${isOwner && canClick ? ', click to cancel' : ''}`
          : `Square owned by ${square.playerDisplayName} at row ${square.row}, column ${square.col}`
      }
    >
      {/* Square Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs sm:text-sm font-medium text-center leading-tight px-1">
          {getTextContent()}
        </span>
      </div>

      {/* Status Indicators */}
      {square.status === 'requested' && (
        <div className="absolute top-1 right-1">
          <div className="w-2 h-2 bg-warning rounded-full"></div>
        </div>
      )}
      
      {square.status === 'approved' && (
        <div className="absolute top-1 right-1">
          <div className="w-2 h-2 bg-success rounded-full"></div>
        </div>
      )}

      {/* Owner Indicator */}
      {isOwner && square.status !== 'available' && (
        <div className="absolute top-1 left-1">
          <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
        </div>
      )}

      {/* Hover Tooltip */}
      {square.playerDisplayName && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-neutral-900 text-white text-xs rounded opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
          {square.playerDisplayName}
          {square.status === 'requested' && (
            <span className="text-warning"> (Pending)</span>
          )}
        </div>
      )}
    </div>
  );
};

export default SquareCell;