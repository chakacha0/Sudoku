namespace Sudoku.API.DTOs;
public class SudokuRequest
{
    // Имя свойства должно быть Board, чтобы соответствовать JSON { "board": [...] }
    public int[][] Board { get; set; } = null!;
}