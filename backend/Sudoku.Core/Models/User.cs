namespace Sudoku.Core.Models;

public class User
{


    private User(Guid id, string username, string email, string passwordHash,int totalXP)
    {
        Id = id;
        Username = username;
        Email = email;
        PasswordHash = passwordHash;
        TotalXP = totalXP;
    }

    public Guid Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }

    public int TotalXP {get; set;}

    public static User Create(Guid id, string username, string email, string passwordHash, int xp)
    {
        return new User(id, username, email, passwordHash, xp);
    }
    
}