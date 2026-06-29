using Sudoku.Core.Models;

namespace Sudoku.Core.Interfaces;

public interface ISudokuRepository
{
    Task<Board?> GetByIDAsync(Guid id);
    Task<Board?> GetUnplayedBoardAsync(Guid userId, int difficulty);
    Task AddAsync(Board board);
}