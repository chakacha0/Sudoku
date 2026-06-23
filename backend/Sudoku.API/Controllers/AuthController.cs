using Microsoft.AspNetCore.Mvc;
using Sudoku.Core.Interfaces;
using Sudoku.API.DTOs;


namespace Sudoku.API.Controllers;

[ApiController]
[Route("api/[controller]")]

public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IRefreshTokenService _tokenService;

    public AuthController(IUserService userService, IRefreshTokenService tokenService)
    {
        _userService = userService;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserRequest request)
    {
        try
        {
            var user = await _userService.RegisterAsync(request.Username, request.Email, request.Password);
            var tokens = await _tokenService.IssueTokensAsync(user);
            return Ok(new AuthResponseDto
            {
                Token = tokens.Token,
                RefreshToken = tokens.RefreshToken,
            });
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
            var user = await _userService.LoginAsync(request.Email, request.Password);
            var tokens = await _tokenService.IssueTokensAsync(user);
            return Ok(new AuthResponseDto
            {
                Token = tokens.Token,
                RefreshToken = tokens.RefreshToken,
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpPost("refresh")]
    public async Task<ActionResult> Refresh([FromBody] RefreshRequest request)
    {
       try
        {
            var result = await _tokenService.RefreshTokenAsync(request.RefreshToken);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return Unauthorized(new { Message = ex.Message });
        }
    }  
}