namespace Sudoku.Core.Interfaces;
public interface ILevelService
{
    (int level, int xpInLevel, int xpRequired, double percent) GetLevelProgress(int XP);
    int GetLevel(int XP);

}