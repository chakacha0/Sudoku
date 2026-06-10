using Sudoku.Core.Interfaces;
using Sudoku.Core.Models;

namespace Sudoku.Core.Services;

public class SudokuGenerator : ISudokuGenerator
{
    private readonly ISudokuValidator _validator;
    private readonly ISudokuSolver _solver; // Добавляем решатель
    private readonly Random _random = new Random();

    // Теперь конструктор просит и валидатор, и решатель
    public SudokuGenerator(ISudokuValidator validator, ISudokuSolver solver)
    {
        _validator = validator;
        _solver = solver;
    }

    public Board Generate(int difficulty)
    {
        var board = new Board();       
        
        FillBoard(board.Cells);

        int targetEmptyCells = GetTargetEmptyCells(difficulty);
        
        RemoveDigits(board, targetEmptyCells);

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

    private void RemoveDigits(Board board, int targetEmptyCells)
    {
        // Создаем список всех 81 координат (0,0), (0,1)...(8,8)
        var positions = new List<(int row, int col)>();
        for (int r = 0; r < 9; r++)
            for (int c = 0; c < 9; c++)
                positions.Add((r, c));

        // Перемешиваем координаты, чтобы удалять числа в случайном порядке
        var shuffledPositions = positions.OrderBy(x => _random.Next()).ToList();

        int removedCount = 0;

        foreach (var pos in shuffledPositions)
        {
            // Если мы уже удалили нужное количество цифр — выходим
            if (removedCount >= targetEmptyCells)
            { Console.WriteLine($"---> STOPPING. Removed {removedCount} cells.");
             break;
            }

            int backupValue = board.Cells[pos.row][pos.col];
            
            // Пытаемся удалить число
            board.Cells[pos.row][pos.col] = 0;

            // Проверяем количество решений. Нам достаточно знать, что их больше 1.
            // Поэтому ставим limit: 2
            if (_solver.CountSolutions(board.Cells, limit: 2) == 1)
            {
                // Если решение всё еще одно — оставляем клетку пустой
                removedCount++;
            }
            else
            {
                // Если появилось больше одного решения — возвращаем число назад
                board.Cells[pos.row][pos.col] = backupValue;
            }
        }
    }

    private int GetTargetEmptyCells(int level)
    {
    // Используем switch для определения диапазона
    return level switch
    {
        1 => _random.Next(20, 31), // Новичок: 20-30 пустых
        2 => _random.Next(31, 41), // Легко: 31-40
        3 => _random.Next(41, 51), // Средне: 41-50
        4 => _random.Next(51, 56), // Сложно: 51-55
        5 => _random.Next(56, 61), // Эксперт: 56-60
        6 => _random.Next(61, 66), // Мастер: 61-65
        _ => 30 // По умолчанию
    };
    }
}