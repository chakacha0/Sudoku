using Sudoku.Core.Models;

namespace Sudoku.Core.Interfaces;

public interface IJwtProvider
{
    string GenerateToken(User user);
    string GenerateRefreshToken();
}