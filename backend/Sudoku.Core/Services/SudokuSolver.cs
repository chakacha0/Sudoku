using Sudoku.Core.Interfaces;
using Sudoku.Core.Models;

namespace Sudoku.Core.Services;

public class SudokuSolver : ISudokuSolver
{ 
    private int _solutionsCount;
    private int[][]? _firstSolution;

     public int[][] GetSolution(int[][] board)
    {
        _solutionsCount = 0;
        _firstSolution = null;

        int[][] cellsCopy = DeepClone(board);
        SolveRecursive(cellsCopy, 1);

        return _firstSolution ?? board; 
    }
    

    public int CountSolutions(int[][] board, int limit = 2)
    {
        _solutionsCount = 0;
        int[][] cellsCopy = DeepClone(board);
        
        SolveRecursive(cellsCopy, limit);
        
        return _solutionsCount;
    }

    private bool SolveRecursive(int[][] cells, int limit)
    {
        if (_solutionsCount >= limit) return true;

        for (int row = 0; row < 9; row++)
        {
            for (int col = 0; col < 9; col++)
            {
                if (cells[row][col] == 0)
                {
                    for (int num = 1; num <= 9; num++)
                    {
                        if (IsSafe(cells, row, col, num))
                        {
                            cells[row][col] = num;
                            if (SolveRecursive(cells, limit)) return true;
                            cells[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }

        _solutionsCount++;

        if (_firstSolution == null)
        {
            _firstSolution = DeepClone(cells);
        }
        
        if (_solutionsCount >= limit) return true;
        return false;
    }

    public bool IsSafe(int[][] grid, int row, int col, int value)
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

    private int[][] DeepClone(int[][] source)
    {
        int[][] target = new int[9][];
        for (int i = 0; i < 9; i++)
        {
            target[i] = (int[])source[i].Clone();
        }
        return target;
    }
}