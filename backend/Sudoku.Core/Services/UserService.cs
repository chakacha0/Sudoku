using Sudoku.Core.Interfaces;
using Sudoku.Core.Models;


namespace Sudoku.Core.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtProvider _jwtProvider;

    public UserService(IUserRepository userRepository, IPasswordHasher passwordHasher, IJwtProvider jwtProvider)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtProvider = jwtProvider;
    }

    public async Task<string> RegisterAsync(string username, string email, string password)
    {
        if (await _userRepository.GetByEmailAsync(email) != null)
            throw new Exception("Пользователь с таким email уже существует.");
        var hashedPassword = _passwordHasher.Hash(password);
        var user = User.Create(
        Guid.NewGuid(),
        username,
        email,
        hashedPassword
        );

        await _userRepository.AddAsync(user);
        return _jwtProvider.GenerateToken(user);
    }

    public async Task<string> LoginAsync(string email, string password)
    {
        var user = await _userRepository.GetByEmailAsync(email);
        if (user == null || !_passwordHasher.Verify(password, user.PasswordHash))
            throw new Exception("Неверный email или пароль.");
        return _jwtProvider.GenerateToken(user);
    }
}