using Sudoku.Core.Models;

namespace Sudoku.Core.Interfaces;

public interface ISudokuSolver
{
    int CountSolutions(int[][] board, int limit = 2);
}