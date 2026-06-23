using Sudoku.Core.Models;

namespace Sudoku.Core.Interfaces;

public interface IRefreshTokenService
{
    Task<(string Token, string RefreshToken)> IssueTokensAsync(User user);
    Task<(string Token, string RefreshToken)> RefreshTokenAsync(string refreshToken);
}
