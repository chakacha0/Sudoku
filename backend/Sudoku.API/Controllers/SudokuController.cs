using Microsoft.AspNetCore.Mvc;
using Sudoku.Core.Interfaces;
using Sudoku.Core.Models;
using Sudoku.API.DTOs;

namespace Sudoku.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SudokuController : ControllerBase
{
    private readonly ISudokuGenerator _generator;
    private readonly ISudokuValidator _validator;
    private readonly ISudokuSolver _solver;
    private readonly ISudokuService _sudokuService;
    private readonly IGameService _gameService;

    public SudokuController(ISudokuGenerator generator, ISudokuValidator validator, ISudokuSolver solver, ISudokuService sudokuService, IGameService gameService )
    {
        _generator = generator;
        _validator = validator;
        _solver = solver;
        _sudokuService = sudokuService;
        _gameService = gameService;
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
    public ActionResult<bool> CheckMove([FromBody] MoveRequestDto request)
    {
        var isValid = _validator.IsMoveValid(request.Grid, request.Row, request.Col, request.Value);
       
        return Ok(new { isValid });
    }

    [HttpPost("get-solution")]
    public ActionResult<int[][]> Solve([FromBody] SudokuRequest request)
    {
      
        var solution = _solver.GetSolution(request.Board);
        
        return Ok(solution);
    }
}

