using Sudoku.Core.Models;

namespace Sudoku.Core.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);

    Task<User?> GetByIdAsync(Guid id);
    Task AddAsync(User user);
    Task UpdateUserAsync(User user);
    Task<User?> GetByNameAsync(string name);
    
}