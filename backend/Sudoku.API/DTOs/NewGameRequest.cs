namespace Sudoku.API.DTOs;

public class NewGameRequest
{
    public int Difficult { get; set; }
    public Guid? UserId { get; set; }
}