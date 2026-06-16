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
    
    public async Task AddAsync(Board board)
    {
        _context.Boards.Add(board);
        await _context.SaveChangesAsync();
    }
}