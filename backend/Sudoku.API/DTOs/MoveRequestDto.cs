namespace Sudoku.API.DTOs;

public class MoveRequestDto
{
    public Guid UserId { get; set; }
    public int Row { get; set; }
    public int Col { get; set; }
    public required int[][] Board { get; set; }
    public int Time { get; set; }

}