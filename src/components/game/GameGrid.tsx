import React from 'react';
import { Game, Square, User } from '@/types';
import SquareCell from './SquareCell';
import { formatSport } from '@/utils/formatters';

interface GameGridProps {
  game: Game;
  squares: Square[];
  onSquareClick: (square: Square) => void;
  currentUser?: User;
  showNumbers?: boolean;
}

const GameGrid: React.FC<GameGridProps> = ({
  game,
  squares,
  onSquareClick,
  currentUser,
  showNumbers = true
}) => {
  // Create a map of squares by position for quick lookup
  const squareMap = squares.reduce((map, square) => {
    const key = `${square.row}-${square.col}`;
    map[key] = square;
    return map;
  }, {} as Record<string, Square>);

  // Generate grid of squares (10x10)
  const renderGrid = () => {
    const rows = [];
    
    for (let row = 0; row < 10; row++) {
      const cells = [];
      
      for (let col = 0; col < 10; col++) {
        const squareKey = `${row}-${col}`;
        const square = squareMap[squareKey] || {
          id: squareKey,
          gameId: game.id,
          row,
          col,
          status: 'available' as const
        };

        cells.push(
          <SquareCell
            key={squareKey}
            square={square}
            gameStatus={game.status}
            isLoggedIn={!!currentUser}
            currentUserId={currentUser?.id}
            onSquareClick={onSquareClick}
            rowNumber={showNumbers && game.rowNumbers ? game.rowNumbers[row] : undefined}
            colNumber={showNumbers && game.colNumbers ? game.colNumbers[col] : undefined}
          />
        );
      }
      
      rows.push(
        <div key={row} className="grid grid-cols-10 gap-1">
          {cells}
        </div>
      );
    }
    
    return rows;
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-6">
      {/* Game Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">
              {game.name}
            </h2>
            <div className="flex items-center space-x-4 mt-2 text-sm text-neutral-600">
              <span>{formatSport(game.sport)}</span>
              <span>•</span>
              <span>{game.homeTeam} vs {game.awayTeam}</span>
              <span>•</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                game.status === 'setup' ? 'bg-neutral-100 text-neutral-800' :
                game.status === 'active' ? 'bg-success/20 text-success' :
                'bg-neutral-400/20 text-neutral-600'
              }`}>
                {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Team Names and Numbers Header */}
        {showNumbers && game.rowNumbers && game.colNumbers && (
          <div className="mb-4">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center mb-2">
              <div className="text-center">
                <h3 className="font-semibold text-neutral-900">{game.awayTeam}</h3>
                <div className="grid grid-cols-10 gap-1 mt-2">
                  {game.colNumbers.map((number, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 flex items-center justify-center bg-primary-100 text-primary-900 text-sm font-bold rounded"
                    >
                      {number}
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-8" /> {/* Spacer */}
              <div />
            </div>
          </div>
        )}
      </div>

      {/* Grid Container */}
      <div className="relative">
        {/* Home Team Numbers (Vertical) */}
        {showNumbers && game.rowNumbers && (
          <div className="absolute left-0 top-0 -ml-12 h-full">
            <div className="flex flex-col justify-between h-full">
              <div className="text-center mb-2 -rotate-90 whitespace-nowrap">
                <span className="font-semibold text-neutral-900">{game.homeTeam}</span>
              </div>
              <div className="flex flex-col space-y-1 flex-1 justify-between">
                {game.rowNumbers.map((number, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 flex items-center justify-center bg-secondary-100 text-secondary-900 text-sm font-bold rounded"
                  >
                    {number}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Game Grid */}
        <div className="space-y-1 ml-0">
          {renderGrid()}
        </div>
      </div>

      {/* Grid Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-neutral-50 border border-neutral-200 rounded"></div>
          <span className="text-neutral-600">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-warning/10 border border-warning rounded"></div>
          <span className="text-neutral-600">Requested</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-primary-100 border border-primary-500 rounded"></div>
          <span className="text-neutral-600">Approved</span>
        </div>
      </div>

      {/* Instructions */}
      {currentUser && game.status === 'setup' && (
        <div className="mt-4 p-4 bg-primary-50 rounded-md">
          <p className="text-sm text-primary-800">
            <strong>How to play:</strong> Click on empty squares to request them. 
            Once approved by the admin, your display name will appear in the square. 
            Numbers will be assigned when the game goes live.
          </p>
        </div>
      )}

      {!currentUser && (
        <div className="mt-4 p-4 bg-neutral-50 rounded-md">
          <p className="text-sm text-neutral-600 text-center">
            <a href="/login" className="text-primary-600 hover:text-primary-500 font-medium">
              Login
            </a> or <a href="/register" className="text-primary-600 hover:text-primary-500 font-medium">
              sign up
            </a> to request squares and participate in this game.
          </p>
        </div>
      )}
    </div>
  );
};

export default GameGrid;