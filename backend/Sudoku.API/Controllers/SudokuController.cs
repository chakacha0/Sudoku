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

    public SudokuController(ISudokuGenerator generator, ISudokuValidator validator)
    {
        _generator = generator;
        _validator = validator;
    }

    [HttpGet("new")]
    public ActionResult<Board> GetNewGame(int difficult)
    {
        Console.WriteLine($"Пришел запрос на сложность: {difficult}"); 
        var board = _generator.Generate(difficult); 
        return Ok(board);
    }

    [HttpPost("check-move")]
    public ActionResult<bool> CheckMove([FromBody] MoveRequestDto request)
    {
        var isValid = _validator.IsMoveValid(request.Grid, request.Row, request.Col, request.Value);
        
        // Вместо просто Ok(isValid) лучше вернуть объект, 
        // чтобы в JS это выглядело как response.data.isValid
        return Ok(new { isValid });
    }
}

