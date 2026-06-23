using Sudoku.Core.Interfaces;
using Sudoku.Core.Models;

namespace Sudoku.Core.Services;

public class RefreshTokenService : IRefreshTokenService
{
    private readonly IRefreshTokenRepository _tokenRepository;
    private readonly IUserRepository _userRepository;
    private readonly IJwtProvider _jwtProvider;

    public RefreshTokenService(
        IRefreshTokenRepository repository,
        IUserRepository userRepository,
        IJwtProvider jwtProvider)
    {
        _tokenRepository = repository;
        _userRepository = userRepository;
        _jwtProvider = jwtProvider;
    }

    public async Task<(string Token, string RefreshToken)> IssueTokensAsync(User user)
    {
        var accessToken = _jwtProvider.GenerateToken(user);
        var refreshToken = _jwtProvider.GenerateRefreshToken();

        await _tokenRepository.AddAsync(new RefreshToken
        {
            Token = refreshToken,
            UserId = user.Id,
            ExpiryDate = DateTime.UtcNow.AddDays(7),
            IsUsed = false,
            IsRevoked = false,
        });

        return (accessToken, refreshToken);
    }

    public async Task<(string Token, string RefreshToken)> RefreshTokenAsync(string refreshToken)
    {
        var storedToken = await _tokenRepository.GetRefresTokenByToken(refreshToken);
        if (storedToken == null || storedToken.IsUsed || storedToken.IsRevoked || storedToken.ExpiryDate < DateTime.UtcNow)
        {
            throw new Exception("Invalid refresh token");
        }

        var user = await _userRepository.GetByIdAsync(storedToken.UserId);
        if (user == null) throw new Exception("User not found");

        storedToken.IsUsed = true;

        var newAccessToken = _jwtProvider.GenerateToken(user);
        var newRefreshToken = _jwtProvider.GenerateRefreshToken();

        await _tokenRepository.AddAsync(new RefreshToken
        {
            Token = newRefreshToken,
            UserId = user.Id,
            ExpiryDate = DateTime.UtcNow.AddDays(7),
            IsUsed = false,
            IsRevoked = false,
        });
        await _tokenRepository.UpdateRefreshTokenAsync(storedToken);

        return (newAccessToken, newRefreshToken);
    }
}
