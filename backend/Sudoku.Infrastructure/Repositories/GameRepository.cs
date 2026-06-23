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

    public async Task<(Game? Game, Board? Board)> GetGameWithBoardAsync(Guid userId)
    {
       var result = await _context.Games
                    .Join(_context.Boards,
                        game => game.BoardId,
                        board => board.Id,
                        (game, board) => new {game, board})
                    .Where(x => x.game.UserId == userId && !x.game.GameEnd)
                    .OrderByDescending(x => x.game.CreatedAt)
                    .Select(x => new {x.game, x.board})
                    .FirstOrDefaultAsync();
        
        if (result == null) return (null, null);
        return (result.game, result.board);
    }

   

    public async Task UpdateGameAsync(Game game)
    {
        _context.Games.Update(game);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteUnfinishedGameByUserIdAsync(Guid userId)
    {
        var unfinishedGames = await _context.Games
            .Where(g => g.UserId == userId && !g.GameEnd)
            .ToListAsync();

        if (unfinishedGames.Count == 0) return;

        _context.Games.RemoveRange(unfinishedGames);
        await _context.SaveChangesAsync();
    }

}