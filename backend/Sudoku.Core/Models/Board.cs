namespace Sudoku.Core.Models;

public class Board
{
    public int[][] Solution { get; set; }   
    public int[][] Task { get; set; }     

    public Board()
    {
        Solution = new int[9][];
        Task = new int[9][];
        for (int i = 0; i < 9; i++)
        {
            Task[i] = new int[9];
            Solution[i]= new int[9];
        }
    }

    public void CopySolutionToCells()
{
    for (int i = 0; i < 9; i++)
    {
        
        Array.Copy(Solution[i], Task[i], 9);
    }
}
}