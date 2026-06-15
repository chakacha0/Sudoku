
namespace Sudoku.Core.Interfaces;

public interface IUserService
{
    Task<string> RegisterAsync(string username, string email, string password);    
    Task<string> LoginAsync(string email, string password);
}