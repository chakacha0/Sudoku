using Sudoku.Core.Models;

namespace Sudoku.Core.Interfaces;

public interface IStatisticsRepository
{      
   Task<Dictionary<int, (int Count, int BestTime)>> GetUserDetailedStats(Guid userId);   
   Task<List<User>> GetTopUsersAsync(int count);   
}