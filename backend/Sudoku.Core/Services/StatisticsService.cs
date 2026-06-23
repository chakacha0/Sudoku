using Sudoku.Core.Interfaces;
using Sudoku.Core.Models;

namespace Sudoku.Core.Services;

public class StatisticsService : IStatisticsService
{
    private IStatisticsRepository _statRepository;

    public StatisticsService(IStatisticsRepository statRepository)
    {
        _statRepository = statRepository;
    }
    public async Task<Dictionary<int, (int Count, int BestTime)>> GetUserStats(Guid userId)
    {
         var stats = new Dictionary <int, (int Count, int BestTime)>
        {
            {1, (0,0)}, {2,(0,0)}, {3, (0,0)}, {4,(0,0)}, {5, (0,0)}
        };

        var userStats = await _statRepository.GetUserDetailedStats(userId);

        foreach (var item in userStats)
        {
            if (stats.ContainsKey(item.Key))
            {
                stats[item.Key] = item.Value; 
            }
        }

        return stats;
    }

    public async Task<List<User>> GetTopUsers()
    {
        return await _statRepository.GetTopUsersAsync(25);
    }

}

