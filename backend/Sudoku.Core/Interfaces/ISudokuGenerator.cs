using Sudoku.Core.Models;

namespace Sudoku.Core.Interfaces;

public interface ISudokuGenerator
{
    Board Generate(int difficulty); // difficulty — сколько цифр оставить
}