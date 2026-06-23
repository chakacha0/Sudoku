using Sudoku.Core.Models;

namespace Sudoku.Core.Interfaces;

public interface IRefreshTokenRepository
{
    Task<RefreshToken?> GetRefresTokenByToken(string RefreshToken);
    Task AddAsync(RefreshToken token);
    Task UpdateRefreshTokenAsync(RefreshToken token);
}
