namespace Sudoku.Core.Models;

public class Game
{
    public Guid Id {get; set;}
    public Guid BoardId {get; set;}
    public Guid UserId {get; set;}
    public int Time {get; set;}
    public int Score {get; set;}
    public DateTime CreatedAt {get; set;}
    public bool GameEnd {get; set;}

    public Game(Guid boardId, Guid userId)
    {
        Id = Guid.NewGuid();
        BoardId = boardId;
        UserId = userId;
        Time = 0;
        Score = 0;
        CreatedAt = DateTime.UtcNow;
        GameEnd = false;   
    }

    public Game(){}

}