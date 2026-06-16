using Sudoku.Core.Models;

namespace Sudoku.Core.Interfaces;

public interface ISudokuRepository
{
    Task<Board?> GetByIDAsync(Guid id);
    
    Task AddAsync(Board board);
}