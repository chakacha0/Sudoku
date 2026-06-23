using Microsoft.AspNetCore.Mvc;
using Sudoku.Core.Interfaces;
using Sudoku.Core.Models;
using Sudoku.API.DTOs;

namespace Sudoku.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SudokuController : ControllerBase
{
    private readonly ISudokuSolver _solver;
    private readonly ISudokuService _sudokuService;
    private readonly IGameService _gameService;
    private readonly IUserService _userService;

    public SudokuController(ISudokuSolver solver, ISudokuService sudokuService, IGameService gameService,IUserService userService)
    {
        _solver = solver;
        _sudokuService = sudokuService;
        _gameService = gameService;
        _userService = userService;
    }

    [HttpPost("new")]
    public async Task<ActionResult<Board>> GetNewGame([FromBody] NewGameRequest request)
    {
        Console.WriteLine($"Пришел запрос на сложность: {request.Difficult}"); 
        var board = await _sudokuService.StartNewGameAsync(request.Difficult);
        if (board == null) 
        {
            return BadRequest("Не удалось создать доску");
        }

        if (request.UserId.HasValue && request.UserId.Value != Guid.Empty)
        {
            await _gameService.StartNewGameAsync(board.Id, request.UserId.Value);
        }

        return Ok(board);
    }

    [HttpPost("check-move")]
    public async Task<ActionResult> CheckMove([FromBody] MoveRequestDto request)
    {
        
        var (score, isCorrect, isGameComplite) = await _gameService.MoveResult(request.UserId, request.Row, request.Col, request.Board, request.Time);
        if (isGameComplite) await _userService.UpdateScore(request.UserId, score);     
        return Ok(new 
        { 
            score, 
            isCorrect,
            isGameComplite 
        });
    }

    [HttpPost("get-solution")]
    public ActionResult<int[][]> Solve([FromBody] SudokuRequest request)
    {
      
        var solution = _solver.GetSolution(request.Board);
        
        return Ok(solution);
    }    
    
}

