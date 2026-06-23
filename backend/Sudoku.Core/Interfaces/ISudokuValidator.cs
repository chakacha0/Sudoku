namespace Sudoku.Core.Interfaces;

public interface ISudokuValidator
{
    bool IsMoveValid(int[][] grid, int row, int col, int value);
    bool IsBoardCompleted(int[][] solution, int[][] currentBoard);
}