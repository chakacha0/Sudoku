using Sudoku.Core.Models;
namespace Sudoku.Core.Interfaces;
public interface IRoomManager
{
    string CreateRoom();
    bool JoinRoom(string roomId, Player player);
    GameRoom? GetRoom(string roomId);
    string? FindRoomIdByConnection(string connectionId);
    void RemovePlayer(string connectionId);
}