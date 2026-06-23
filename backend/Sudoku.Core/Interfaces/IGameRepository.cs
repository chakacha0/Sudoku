using Sudoku.Core.Models;

namespace Sudoku.Core.Interfaces;

public interface IGameRepository
{
      
    Task AddAsync(Game game);
    Task<(Game? Game, Board? Board)> GetGameWithBoardAsync(Guid userId);

    Task UpdateGameAsync(Game game);
    Task DeleteUnfinishedGameByUserIdAsync(Guid userId);
}