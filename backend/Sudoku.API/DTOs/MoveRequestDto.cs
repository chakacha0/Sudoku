namespace Sudoku.API.DTOs;

public class MoveRequestDto
{
    public required int[][] Grid { get; set; }
    public int Row { get; set; }
    public int Col { get; set; }
    public int Value { get; set; }
}