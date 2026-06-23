using Microsoft.EntityFrameworkCore;
using Sudoku.Core.Models;
using Sudoku.Core.Interfaces;
using Sudoku.Infrastructure.Persistence;

namespace Sudoku.Infrastructure.Repositories;

   
public class UserRepository : IUserRepository
{
    private readonly SudokuDbContext _context;

    public UserRepository(SudokuDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task AddAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User?> GetByNameAsync(string name)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Username == name);
    }


    public async Task UpdateUserAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }
   
}