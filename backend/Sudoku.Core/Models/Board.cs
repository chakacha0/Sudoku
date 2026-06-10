namespace Sudoku.Core.Models;

public class Board
{
    public int[][] Cells { get; set; }

    public List<MoveHistory> History { get; set; } = new List<MoveHistory>();

    public Board()
    {
        Cells = new int[9][];
        for (int i = 0; i < 9; i++)
        {
            Cells[i] = new int[9];
        }
    }
}