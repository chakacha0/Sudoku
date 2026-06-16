using Sudoku.Core.Models;

namespace Sudoku.Core.Interfaces;

public interface IGameRepository
{
      
    Task AddAsync(Game game);
}