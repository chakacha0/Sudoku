using Sudoku.Core.Models;

namespace Sudoku.Core.Interfaces;

public interface IGameService
{
    Task StartNewGameAsync(Guid boardId, Guid userId);    
    
}