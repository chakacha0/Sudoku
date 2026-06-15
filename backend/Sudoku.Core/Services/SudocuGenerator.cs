using Sudoku.Core.Interfaces;
using Sudoku.Core.Models;

namespace Sudoku.Core.Services;

public class SudokuGenerator : ISudokuGenerator
{
    private readonly ISudokuValidator _validator;
    private readonly ISudokuSolver _solver;
    private readonly Random _random = new Random();

    
    public SudokuGenerator(ISudokuValidator validator, ISudokuSolver solver)
    {
        _validator = validator;
        _solver = solver;
    }

    public Board Generate(int difficulty)
    {
        var board = new Board();       
        
        FillBoard(board.Solution);

        board.CopySolutionToCells();

        int targetEmptyCells = GetTargetEmptyCells(difficulty);
        
        RemoveDigits(board.Task, targetEmptyCells);

        return board;
    }

    private bool FillBoard(int[][] grid)
    {
        for (int row = 0; row < 9; row++)
        {
            for (int col = 0; col < 9; col++)
            {
                if (grid[row][col] == 0)
                {
                    var numbers = Enumerable.Range(1, 9).OrderBy(x => _random.Next()).ToList();
                    foreach (var num in numbers)
                    {
                        if (_validator.IsMoveValid(grid, row, col, num))
                        {
                            grid[row][col] = num;
                            if (FillBoard(grid)) return true;
                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    private void RemoveDigits(int[][] board, int targetEmptyCells)
    {

        var positions = new List<(int row, int col)>();
        for (int r = 0; r < 9; r++)
            for (int c = 0; c < 9; c++)
                positions.Add((r, c));

        
        var shuffledPositions = positions.OrderBy(x => _random.Next()).ToList();

        int removedCount = 0;

        foreach (var pos in shuffledPositions)
        {
            
            if (removedCount >= targetEmptyCells)
            { Console.WriteLine($"---> STOPPING. Removed {removedCount} cells.");
             break;
            }

            int backupValue = board[pos.row][pos.col];
            
            
            board[pos.row][pos.col] = 0;

            
            if (_solver.CountSolutions(board, limit: 2) == 1)
            {
                
                removedCount++;
            }
            else
            {
                
                board[pos.row][pos.col] = backupValue;
            }            
        }
        if (removedCount < targetEmptyCells)
                {
                    Console.WriteLine($"[Warning] Не удалось достичь цели. Удалено {removedCount} вместо {targetEmptyCells}");
                }
    }

    private int GetTargetEmptyCells(int level)
    {

    return level switch
    {
        1 => _random.Next(20, 31), 
        2 => _random.Next(31, 41), 
        3 => _random.Next(41, 51), 
        4 => _random.Next(51, 56), 
        5 => _random.Next(56, 61), 
        6 => _random.Next(61, 64), 
        _ => 30 
    };
    }
}