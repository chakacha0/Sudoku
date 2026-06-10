namespace Sudoku.Core.Models;

public class MoveHistory
{
    public int Row { get; set; }
    public int Col { get; set; }
    public int OldValue { get; set; }
    public int NewValue { get; set; }    
}