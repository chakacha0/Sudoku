using Sudoku.Core.Interfaces;
using Sudoku.Core.Models;
using System.Collections.Concurrent;
namespace Sudoku.Core.Services;


public class RoomManager : IRoomManager
{
    private readonly ConcurrentDictionary<string, GameRoom> _rooms = new();

    public string CreateRoom()
    {
        var roomId = Guid.NewGuid().ToString().Substring(0, 6).ToUpper();
        _rooms[roomId] = new GameRoom{ Id = roomId };
        return roomId;
    }

    public bool JoinRoom(string roomId, Player player)
    {
        if (_rooms.TryGetValue(roomId, out var room))
        {
            if (!room.Players.Any(p => p.ConnectionId == player.ConnectionId))
            {
                room.Players.Add(player);
            }

            return true;
        }
        return false;
    }

    public GameRoom? GetRoom(string roomId)
    {
        return _rooms.GetValueOrDefault(roomId);
    }

    public string? FindRoomIdByConnection(string connectionId)
    {
        foreach (var entry in _rooms)
        {
            if (entry.Value.Players.Any(p => p.ConnectionId == connectionId))
            {
                return entry.Key;
            }
        }

        return null;
    }

    public void RemovePlayer(string connectionId)
    {
        foreach(var room in _rooms.Values)
        {
            room.Players.RemoveAll(p => p.ConnectionId == connectionId);
        } 
    } 
}
