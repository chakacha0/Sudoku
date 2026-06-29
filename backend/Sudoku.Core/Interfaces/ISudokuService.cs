using Sudoku.Core.Models;

namespace Sudoku.Core.Interfaces;


public interface ISudokuService
{
    Task<Board?> StartNewGameAsync(int difficulty, Guid? userId = null);
}