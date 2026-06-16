using Microsoft.EntityFrameworkCore;
using Sudoku.Core.Models;
using Sudoku.Core.Interfaces;
using Sudoku.Infrastructure.Persistence;

namespace Sudoku.Infrastructure.Repositories;

public class GameRepository : IGameRepository
{
    private readonly SudokuDbContext _context;

    public GameRepository (SudokuDbContext context)
    {
        _context = context;
    }
        public async Task AddAsync(Game game)
    {
        _context.Games.Add(game);
        await _context.SaveChangesAsync();
    }
}