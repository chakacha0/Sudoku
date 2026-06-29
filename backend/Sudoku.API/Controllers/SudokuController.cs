using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
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
    [Authorize]
    public async Task<ActionResult<Board>> GetNewGame([FromBody] NewGameRequest request)
    {
        var userId = GetCurrentUserId();
        Console.WriteLine($"Пришел запрос на сложность: {request.Difficult}"); 
        var board = await _sudokuService.StartNewGameAsync(request.Difficult, userId);
        if (board == null) 
        {
            return BadRequest("Не удалось создать доску");
        }

        await _gameService.StartNewGameAsync(board.Id, userId);

        return Ok(board);
    }

    [HttpPost("check-move")]
    [Authorize]
    public async Task<ActionResult> CheckMove([FromBody] MoveRequestDto request)
    {
        var userId = GetCurrentUserId();
        var (score, isCorrect, isGameComplite) = await _gameService.MoveResult(userId, request.Row, request.Col, request.Board, request.Time);
        if (isGameComplite) await _userService.UpdateScore(userId, score);     
        return Ok(new 
        { 
            score, 
            isCorrect,
            isGameComplite 
        });
    }

    [HttpPost("get-solution")]
    [AllowAnonymous]
    public ActionResult<int[][]> Solve([FromBody] SudokuRequest request)
    {
        var solution = _solver.GetSolution(request.Board);
        return Ok(solution);
    }

    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)
            ?? User.FindFirst(JwtRegisteredClaimNames.Sub);

        if (claim == null || !Guid.TryParse(claim.Value, out var userId))
        {
            throw new UnauthorizedAccessException("Не удалось определить пользователя");
        }

        return userId;
    }
}
