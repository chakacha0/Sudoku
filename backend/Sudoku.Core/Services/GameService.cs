using Sudoku.Core.Interfaces;
using Sudoku.Core.Models;

namespace Sudoku.Core.Services;

public class GameService : IGameService
{
    private readonly IGameRepository _repository;
    private readonly ICalculateScoreService _scoreService;

    private readonly ISudokuValidator _validator;



    public GameService(IGameRepository repository, ICalculateScoreService scoreService, ISudokuValidator validator)
    {
        _repository = repository;
        _scoreService = scoreService;
        _validator = validator;
    }

    public async Task StartNewGameAsync(Guid boardId, Guid userId)
    {
        await _repository.DeleteUnfinishedGameByUserIdAsync(userId);
        var game = new Game(boardId, userId);

        await _repository.AddAsync(game);
    }

    public async Task<(int Score, bool IsCorrect, bool IsGameComplite)> MoveResult(Guid userId, int row, int col, int[][] boardStateOnMove, int timeInSecond)
    {
        var (game, board) = await _repository.GetGameWithBoardAsync(userId);

        if (game == null || board == null)
        {
            throw new Exception("Активная игра не найдена");
        }        

        bool IsCorrect = board.Solution[row][col] == boardStateOnMove[row][col];
        int PointsForMove = _scoreService.CalculateMoveScore(IsCorrect, board.Difficulty, timeInSecond);     
        
        bool isGameComplete = false;
        if(_validator.IsBoardCompleted(board.Solution, boardStateOnMove))
        {
            game.GameEnd = true;
            isGameComplete = true;
        }

        game.Score+=PointsForMove;
        game.Time= timeInSecond;

        await _repository.UpdateGameAsync(game);

        return (game.Score,IsCorrect,isGameComplete);       
    }
    



}