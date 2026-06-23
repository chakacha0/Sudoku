using Sudoku.Core.Models;

namespace Sudoku.Core.Interfaces;

public interface IStatisticsService
{
   Task<Dictionary<int, (int Count, int BestTime)>> GetUserStats(Guid userId);
   Task<List<User>> GetTopUsers();
}