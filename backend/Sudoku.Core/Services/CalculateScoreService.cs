using Sudoku.Core.Interfaces;
namespace Sudoku.Core.Services;

public class CalculateScoreService : ICalculateScoreService
{
    public const int CorrectMoveBase = 200;
    public const int IncorrectMove = 50;    

    public static readonly IReadOnlyDictionary<int, double> DifficultyBonus =
    new Dictionary<int, double>
    {
        {2, 1.0},
        {3, 1.09},
        {4, 1.18},
        {5, 1.25},
        {6, 1.39}
    };

    public static double GetDifficultyBonus(int difficulty)
        => DifficultyBonus.TryGetValue(difficulty, out var m)? m:1.0;
    public int CalculateMoveScore(bool isCorrect, int difficulty, int timeInSecond)
    {
      
        if (!isCorrect)            
            return  -IncorrectMove; 

        double bonus = GetDifficultyBonus(difficulty);

        int TimeBonus = timeInSecond/5;

        int PointsForMove = (int)(CorrectMoveBase*bonus);

        if (TimeBonus>PointsForMove) return 15;
        
        return PointsForMove-TimeBonus;     
    }          
            

}