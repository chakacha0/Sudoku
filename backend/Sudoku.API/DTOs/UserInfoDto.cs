namespace Sudoku.API.DTOs;

public class DifficultyStatsDto
{
    public int Count { get; set; }
    public int BestTime { get; set; }
}

public class UserInfoDto
{
    public required string Username{get; set;}
    public required string Email{get; set;}
    public int Level{get;set;}
    public int XpInLevel{get; set;}
    public int XpRequired{get;set;}
    public double Percent{get;set;}

    public Dictionary<int, DifficultyStatsDto> Statistics { get; set; } = [];
} 