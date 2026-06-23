
using Sudoku.Core.Models;

namespace Sudoku.Core.Interfaces;

public interface IUserService
{
    Task<User> RegisterAsync(string username, string email, string password);
    Task<User> LoginAsync(string email, string password);
    Task UpdateScore(Guid userId, int Score);
    Task<(User, int, int, int, double)> GetUserInfo(Guid userId);
}