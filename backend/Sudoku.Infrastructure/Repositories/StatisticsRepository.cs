
using Microsoft.EntityFrameworkCore;
using Sudoku.Core.Interfaces;
using Sudoku.Core.Models;
using Sudoku.Infrastructure.Persistence;

namespace Sudoku.Infrastructure.Repositories;

public class StatisticsRepository : IStatisticsRepository
{
    private readonly SudokuDbContext _context;

    public StatisticsRepository (SudokuDbContext context)
    {
        _context = context;
    }
    
    public async Task<Dictionary<int, (int Count, int BestTime)>> GetUserDetailedStats(Guid userId)
    {
        return await _context.Games
            .Where(g => g.UserId == userId && g.GameEnd == true)
            .Join(_context.Boards, 
                g => g.BoardId, 
                b => b.Id, 
                (g, b) => new { b.Difficulty, g.Time })
            .GroupBy(x => x.Difficulty)
            .ToDictionaryAsync(
                group => group.Key, 
                group => (Count: group.Count(), BestTime: group.Min(x => x.Time))
            );
    }

    public async Task<List<User>> GetTopUsersAsync(int count)
    {
        return await _context.Users
            .OrderByDescending(u => u.TotalXP)
            .Take(count)
            .ToListAsync();
    }
}
