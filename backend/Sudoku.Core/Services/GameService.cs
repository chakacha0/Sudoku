using Sudoku.Core.Interfaces;
using Sudoku.Core.Models;

namespace Sudoku.Core.Services;

public class GameService : IGameService
{
    private readonly IGameRepository _repository;

    public GameService(IGameRepository repository)
    {
        _repository = repository;
    }

    public async Task StartNewGameAsync(Guid boardId, Guid userId)
    {
        var game = new Game(boardId, userId);
        await _repository.AddAsync(game);
    }

}