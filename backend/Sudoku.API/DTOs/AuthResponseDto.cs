namespace Sudoku.API.DTOs;

public class AuthResponseDto
{
    public required string Token { get; set; }
    public required string RefreshToken { get; set; }
}
