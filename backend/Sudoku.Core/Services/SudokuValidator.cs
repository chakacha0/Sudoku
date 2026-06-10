using Sudoku.Core.Interfaces;

namespace Sudoku.Core.Services;

public class SudokuValidator : ISudokuValidator
{
    private readonly ISudokuSolver _solver;
    public SudokuValidator(ISudokuSolver solver)
    {        
        _solver = solver;
    }
    // Проверка: можно ли поставить значение в конкретную клетку
    public bool IsMoveValid(int[][] grid, int row, int col, int value)
    {
        if (value < 1 || value > 9) return false;

        // 1. Проверяем строку (row)
        for (int i = 0; i < 9; i++)
        {
            // Пропускаем ту же самую клетку, которую проверяем (i != col)
            if (i != col && grid[row][i] == value) 
                return false;
        }

        // 2. Проверяем столбец (col)
        for (int i = 0; i < 9; i++)
        {
            if (i != row && grid[i][col] == value) 
                return false;
        }

        // 3. Проверяем малый квадрат 3x3
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

        if (_solver.CountSolutions(grid, limit: 2) == 0) return false; 

        return true; // Если ни одно правило не нарушено
    }

    // Проверка: решена ли вся головоломка целиком
    public bool IsBoardCompleted(int[][] grid)
    {
        for (int r = 0; r < 9; r++)
        {
            for (int c = 0; c < 9; c++)
            {
                int val = grid[r][c];
                
                // Если есть пустая клетка (0) или число нарушает правила
                if (val == 0 || !IsMoveValid(grid, r, c, val))
                {
                    return false;
                }
            }
        }
        return true;
    }
}