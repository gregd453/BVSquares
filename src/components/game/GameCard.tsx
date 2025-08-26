import React from 'react';
import Link from 'next/link';
import { Game } from '@/types';
import BaseCard from '@/components/ui/BaseCard';
import { formatDate, formatSport, getGameStatusColor } from '@/utils/formatters';

interface GameCardProps {
  game: Game;
  showActions?: boolean;
  isAdmin?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ 
  game, 
  showActions = false, 
  isAdmin = false 
}) => {
  return (
    <BaseCard hover className="h-full">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">
              {game.name}
            </h3>
            <p className="text-neutral-600">
              {formatSport(game.sport)}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getGameStatusColor(game.status)}`}>
            {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
          </span>
        </div>

        {/* Teams */}
        <div className="mb-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <p className="font-medium text-neutral-900">{game.homeTeam}</p>
              {game.scores?.homeFinal !== undefined && (
                <p className="text-2xl font-bold text-primary-600">
                  {game.scores.homeFinal}
                </p>
              )}
            </div>
            <div className="text-neutral-400 text-sm">vs</div>
            <div className="text-center">
              <p className="font-medium text-neutral-900">{game.awayTeam}</p>
              {game.scores?.awayFinal !== undefined && (
                <p className="text-2xl font-bold text-primary-600">
                  {game.scores.awayFinal}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Game Date */}
        <div className="mb-4">
          <p className="text-sm text-neutral-500 text-center">
            {formatDate(game.gameDate)}
          </p>
        </div>

        {/* Payout Structure */}
        <div className="mb-4 bg-neutral-50 rounded-md p-3">
          <h4 className="text-sm font-medium text-neutral-900 mb-2">Payout Structure:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600">
            <div>Q1: {game.payoutStructure.firstQuarter}%</div>
            <div>Q2: {game.payoutStructure.secondQuarter}%</div>
            <div>Q3: {game.payoutStructure.thirdQuarter}%</div>
            <div>Final: {game.payoutStructure.finalScore}%</div>
          </div>
        </div>

        {/* Numbers Status */}
        {game.status === 'active' && game.rowNumbers && game.colNumbers && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-success font-medium">Numbers Assigned</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto pt-4">
          {showActions && (
            <div className="flex space-x-2">
              {isAdmin ? (
                <>
                  <Link
                    href={`/admin/games/${game.id}/manage`}
                    className="flex-1 bg-primary-500 text-white text-center py-2 px-4 rounded-md hover:bg-primary-600 transition-colors text-sm font-medium"
                  >
                    Manage
                  </Link>
                  <Link
                    href={`/admin/games/${game.id}/edit`}
                    className="flex-1 border border-neutral-300 text-neutral-700 text-center py-2 px-4 rounded-md hover:bg-neutral-50 transition-colors text-sm font-medium"
                  >
                    Edit
                  </Link>
                </>
              ) : (
                <Link
                  href={`/games/${game.id}`}
                  className="w-full bg-primary-500 text-white text-center py-2 px-4 rounded-md hover:bg-primary-600 transition-colors text-sm font-medium"
                >
                  {game.status === 'setup' ? 'Join Game' : 'View Game'}
                </Link>
              )}
            </div>
          )}

          {!showActions && (
            <Link
              href={`/games/${game.id}`}
              className="block w-full text-center text-primary-600 hover:text-primary-500 font-medium text-sm"
            >
              View Details →
            </Link>
          )}
        </div>
      </div>
    </BaseCard>
  );
};

export default GameCard;