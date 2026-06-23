
using Sudoku.Core.Interfaces;
namespace Sudoku.Core.Services;

public class LevelService : ILevelService
{
    private const int LevelingBase = 2500;

    public int GetLevel(int XP)
    {
        return (int)Math.Floor(Math.Sqrt(XP/LevelingBase))+1;
    }
    public (int level, int xpInLevel, int xpRequired, double percent) GetLevelProgress(int XP)
    {
       
        var level = GetLevel(XP);
        int xpForCurrentLevelStart = GetTotalXpForLevel(level);
        int xpForNextLevelStart = GetTotalXpForLevel(level + 1);

        int xpInCurrentLevel = XP - xpForCurrentLevelStart; 
        int xpRequiredForNextLevel = xpForNextLevelStart - xpForCurrentLevelStart;

        double progressPrecent = Math.Round((double)xpInCurrentLevel/xpRequiredForNextLevel * 100, 1);

        return (level, xpInCurrentLevel, xpRequiredForNextLevel, progressPrecent);      
        
    }

    private int GetTotalXpForLevel(int level)
    {
        if (level<=1)return 0;
        return LevelingBase * (int)Math.Pow(level - 1, 2);
    }
}