namespace Sudoku.Core.Models;

public class Board
{
    public Guid Id {get; set;}
    public int[][] Solution { get; set; } = null!;  
    public int[][] Task { get; set; } = null!;  

    public int Difficulty {get; set;}

    public Board(){}  

    public Board(int difficulty)
    {
        Difficulty = difficulty;
        Id = Guid.NewGuid(); 
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