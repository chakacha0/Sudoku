namespace Sudoku.Core.Interfaces;
public interface ICalculateScoreService
{
    int CalculateMoveScore(bool isCorrect, int difficulty, int timeInSeconds);
}