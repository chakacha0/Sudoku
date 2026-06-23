using Microsoft.EntityFrameworkCore;
using Sudoku.Core.Models;
using Sudoku.Core.Interfaces;
using Sudoku.Infrastructure.Persistence;

namespace Sudoku.Infrastructure.Repositories;

   
public class RefreshTokenRepository : IRefreshTokenRepository
{
    private readonly SudokuDbContext _context;

    public RefreshTokenRepository (SudokuDbContext context)
    {
        _context = context;
    }

    public async Task<RefreshToken?> GetRefresTokenByToken(string RefreshToken)
    {
        return await _context.RefreshTokens.FirstOrDefaultAsync(x => x.Token == RefreshToken);
    }
     public async Task AddAsync(RefreshToken token)
    {
        _context.RefreshTokens.Add(token);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateRefreshTokenAsync(RefreshToken token)
    {
        _context.RefreshTokens.Update(token);
        await _context.SaveChangesAsync();
    }
}

