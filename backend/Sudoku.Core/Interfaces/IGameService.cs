using Sudoku.Core.Models;

namespace Sudoku.Core.Interfaces;

public interface IGameService
{
    Task StartNewGameAsync(Guid boardId, Guid userId);    
    Task<(int Score, bool IsCorrect, bool IsGameComplite)> MoveResult(Guid userId, int row, int col, int[][] board, int timeInSecond);
}