using Sudoku.Core.Interfaces;
using Sudoku.Core.Models;


namespace Sudoku.Core.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtProvider _jwtProvider;
    private readonly ILevelService _levelService;

    public UserService(IUserRepository userRepository, IPasswordHasher passwordHasher, IJwtProvider jwtProvider, ILevelService levelService)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtProvider = jwtProvider;
        _levelService = levelService;
    }

    public async Task<User> RegisterAsync(string username, string email, string password)
    {
        if (await _userRepository.GetByEmailAsync(email) != null)
            throw new Exception("Пользователь с таким email уже существует.");
        if (await _userRepository.GetByNameAsync(username) != null)
            throw new Exception("Пользователь с таким именем уже существует.");
        var hashedPassword = _passwordHasher.Hash(password);
        var user = User.Create(
        Guid.NewGuid(),
        username,
        email,
        hashedPassword,
        0
        );

        await _userRepository.AddAsync(user);
        return user;
    }

    public async Task<User> LoginAsync(string email, string password)
    {
        var user = await _userRepository.GetByEmailAsync(email);
        if (user == null || !_passwordHasher.Verify(password, user.PasswordHash))
            throw new Exception("Неверный email или пароль.");
        return user;
    }

    public async Task UpdateScore(Guid userId, int Score)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        
        if (user == null)
            throw new Exception("Пользователя с заданным id не существует");

        user.TotalXP += Score;

        await _userRepository.UpdateUserAsync(user);
    }

    public async Task<(User, int, int, int, double)> GetUserInfo(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        
        if (user == null)
            throw new Exception("Пользователя с заданным id не существует");

        var (Level, XpInLevel, XpRequired, Percent) = _levelService.GetLevelProgress(user.TotalXP);   

        return (user,Level, XpInLevel, XpRequired, Percent);

    }
}