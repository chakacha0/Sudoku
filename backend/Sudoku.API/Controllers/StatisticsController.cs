using Microsoft.AspNetCore.Mvc;
using Sudoku.Core.Interfaces;
using Sudoku.API.DTOs;

namespace Sudoku.API.Controllers;

[ApiController]
[Route("api/[controller]")]

public class StatisticsController : ControllerBase
{
    private readonly IStatisticsService _statService;
    private readonly ILevelService _levelService;
    public StatisticsController(IStatisticsService statService, ILevelService levelService)
    {
        
        _statService = statService;
        _levelService = levelService;
    }

    [HttpGet("leaderboard")]
    public async Task<ActionResult<List<LeaderBoardDto>>> GetLeaderBoard()
    {
        var users = await _statService.GetTopUsers();

        var response = users.Select((u, index) => new LeaderBoardDto
        {
            Rank = index + 1,
            Username = u.Username,
            TotalXP = u.TotalXP,
            Level = _levelService.GetLevel(u.TotalXP)
        });

        return Ok(response);
    }
} 