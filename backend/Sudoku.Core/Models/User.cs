namespace Sudoku.Core.Models;

public class User
{

    private User(Guid id, string username, string email, string passwordHash)
    {
        Id = id;
        Username = username;
        Email = email;
        PasswordHash = passwordHash;
    }

    public Guid Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }

    public static User Create(Guid id, string username, string email, string passwordHash)
    {
        return new User(id, username, email, passwordHash);
    }
}