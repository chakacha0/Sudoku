using Sudoku.Core.Interfaces;

namespace Sudoku.Infrastructure.Authentication;

public class PasswordHasher : IPasswordHasher
{
    public string Hash(string password) => BCrypt.Net.BCrypt.EnhancedHashPassword(password);
    public bool Verify(string password, string passwordHash) =>
        BCrypt.Net.BCrypt.EnhancedVerify(password, passwordHash);
}