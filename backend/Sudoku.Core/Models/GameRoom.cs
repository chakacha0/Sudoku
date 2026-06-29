namespace Sudoku.Core.Models;

public enum GameStatus { Waiting, Playing, Finished }

public enum PlayerStatus { Playing, Won, Lost }

public class Player
{
    public required string ConnectionId { get; set; }
    public required string Name { get; set; }
    public int FilledCells { get; set; }
    public int MistakeCount { get; set; }
    public PlayerStatus Status { get; set; } = PlayerStatus.Playing;
    public long? FinishTimeMs { get; set; }
    public int? Place { get; set; }
}

public class GameRoom
{
    public required string Id { get; set; }
    public List<Player> Players { get; set; } = new();
    public GameStatus Status { get; set; } = GameStatus.Waiting;
    public string? HostConnectionId { get; set; }
    public int Difficulty { get; set; }
    public int TotalEmptyCells { get; set; }
    public DateTime? GameStartedAt { get; set; }
    public int[][]? Task { get; set; }
    public int[][]? Solution { get; set; }
}
