using Microsoft.AspNetCore.Mvc;
using Sudoku.Core.Interfaces;
using Sudoku.API.DTOs;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace Sudoku.API.Controllers;

[ApiController]
[Route("api/[controller]")]

public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IStatisticsService _statService;
    public UserController(IUserService userService, IStatisticsService statService)
    {
        _userService = userService;
        _statService = statService;
    }

    [HttpGet("user-info")]
    [Authorize]
    public async Task<ActionResult<UserInfoDto>> GetUserInfo()
    { 
    
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();

        var userId = Guid.Parse(userIdClaim.Value);              

        var (user, level, xpInLevel, xpRequired, percent) = await _userService.GetUserInfo(userId);

        var userStats = await _statService.GetUserStats(userId);

        if (user == null) return NotFound();
        var response = new UserInfoDto
        {
            Username = user.Username,
            Email = user.Email,
            Level = level,
            XpInLevel = xpInLevel,
            XpRequired = xpRequired,
            Percent = percent,
            Statistics = userStats.ToDictionary(
                x => x.Key,
                x => new DifficultyStatsDto
                {
                    Count = x.Value.Count,
                    BestTime = x.Value.BestTime
                }
            )
             
        };
        return Ok(response); 
    }   

}

