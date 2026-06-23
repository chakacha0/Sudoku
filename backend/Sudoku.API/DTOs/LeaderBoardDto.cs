namespace Sudoku.API.DTOs;

public class LeaderBoardDto
{
    public int Rank {get; set;}
    public required string Username { get; set; }
    public int Level { get; set; }
    public int TotalXP { get; set; }
    public int Time { get; set; }

}