using Sudoku.Core.Interfaces;

namespace Sudoku.Core.Services;

public class SudokuValidator : ISudokuValidator
{
    public bool IsMoveValid(int[][] grid, int row, int col, int value)
    {
        if (value < 1 || value > 9) return false;

        for (int i = 0; i < 9; i++)
        {
            if (i != col && grid[row][i] == value) 
                return false;
        }

        for (int i = 0; i < 9; i++)
        {
            if (i != row && grid[i][col] == value) 
                return false;
        }

        int startRow = (row / 3) * 3;
        int startCol = (col / 3) * 3;

        for (int r = startRow; r < startRow + 3; r++)
        {
            for (int c = startCol; c < startCol + 3; c++)
            {
                if ((r != row || c != col) && grid[r][c] == value)
                    return false;
            }
        }        

        return true; 
    }

    public bool IsBoardCompleted(int[][] grid)
    {
        for (int r = 0; r < 9; r++)
        {
            for (int c = 0; c < 9; c++)
            {
                int val = grid[r][c];
                
                if (val == 0 || !IsMoveValid(grid, r, c, val))
                {
                    return false;
                }
            }
        }
        return true;
    }
}