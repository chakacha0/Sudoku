using Microsoft.AspNetCore.Mvc;
using Sudoku.Core.Interfaces;
using Sudoku.API.DTOs;

namespace Sudoku.API.Controllers;

[ApiController]
[Route("api/[controller]")]

public class AuthController : ControllerBase
{
    private readonly IUserService _userService;

    public AuthController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserRequest request)
    {
        try
        {
            var token = await _userService.RegisterAsync(request.Username, request.Email, request.Password);
            return Ok(new { Token = token });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }


    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginUserRequest request)
    {
        try
        {
            var token = await _userService.LoginAsync(request.Email, request.Password);
            return Ok(new { Token = token });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }
   
}