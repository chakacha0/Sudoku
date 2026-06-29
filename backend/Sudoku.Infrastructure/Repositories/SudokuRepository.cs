using Microsoft.EntityFrameworkCore;
using Sudoku.Core.Models;
using Sudoku.Core.Interfaces;
using Sudoku.Infrastructure.Persistence;

namespace Sudoku.Infrastructure.Repositories;

public class SudokuRepository : ISudokuRepository
{
    private readonly SudokuDbContext _context;

    public SudokuRepository (SudokuDbContext context)
    {
        _context = context;
    }
    public async Task<Board?> GetByIDAsync(Guid id)
    {
        return await _context.Boards
                .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<Board?> GetUnplayedBoardAsync(Guid userId, int difficulty)
    {
        return await _context.Boards
            .Where(b => b.Difficulty == difficulty)
            .Where(b => !_context.Games.Any(g => g.UserId == userId && g.BoardId == b.Id))
            .OrderBy(b => b.Id)
            .FirstOrDefaultAsync();
    }
    
    public async Task AddAsync(Board board)
    {
        _context.Boards.Add(board);
        await _context.SaveChangesAsync();
    }
}