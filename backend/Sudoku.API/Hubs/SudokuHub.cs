using Microsoft.AspNetCore.SignalR;
using Sudoku.Core.Interfaces;
using Sudoku.Core.Models;

namespace Sudoku.API.Hubs;

public class SudokuHub : Hub
{
    private readonly IRoomManager _roomManager;
    private readonly ISudokuService _sudokuService;

    public SudokuHub(IRoomManager roomManager, ISudokuService sudokuService)
    {
        _roomManager = roomManager;
        _sudokuService = sudokuService;
    }

    public async Task CreateRoom(string playerName)
    {
        var roomId = _roomManager.CreateRoom();
        var room = _roomManager.GetRoom(roomId)!;
        room.HostConnectionId = Context.ConnectionId;

        var player = new Player { ConnectionId = Context.ConnectionId, Name = playerName };
        _roomManager.JoinRoom(roomId, player);

        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
        await Clients.Caller.SendAsync("RoomCreated", roomId);
        await UpdateRoomPlayers(roomId);
    }

    public async Task JoinRoom(string roomId, string playerName)
    {
        var player = new Player { ConnectionId = Context.ConnectionId, Name = playerName };
        var success = _roomManager.JoinRoom(roomId, player);

        if (!success)
        {
            await Clients.Caller.SendAsync("Error", "Комната не найдена");
            return;
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
        await Clients.Group(roomId).SendAsync("UserJoined", playerName);
        await Clients.Caller.SendAsync("JoinedSuccess", roomId);
        await UpdateRoomPlayers(roomId);

        var room = _roomManager.GetRoom(roomId);
        if (room?.Status is GameStatus.Playing or GameStatus.Finished && room.Task != null)
        {
            await Clients.Caller.SendAsync("GameStarted", BuildGamePayload(room));
            await BroadcastPlayerProgress(roomId);

            if (room.Status == GameStatus.Finished)
            {
                await Clients.Caller.SendAsync("GameOver", BuildGameOverPayload(room));
            }
        }
    }

    public async Task UpdateRoomPlayers(string roomId)
    {
        var room = _roomManager.GetRoom(roomId);
        if (room != null)
        {
            await Clients.Group(roomId).SendAsync("UpdatePlayerList", room.Players.Select(p => p.Name));
        }
    }

    public async Task UpdateProgress(string roomId, int filledCells, int mistakeCount)
    {
        var room = _roomManager.GetRoom(roomId);
        if (room == null || room.Status != GameStatus.Playing) return;

        var player = room.Players.FirstOrDefault(p => p.ConnectionId == Context.ConnectionId);
        if (player == null || player.Status != PlayerStatus.Playing) return;

        player.FilledCells = filledCells;
        player.MistakeCount = mistakeCount;

        await BroadcastPlayerProgress(roomId);
    }

    public async Task LeaveRoom(string roomId)
    {
        var room = _roomManager.GetRoom(roomId);
        if (room == null) return;

        _roomManager.RemovePlayer(Context.ConnectionId);
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);
        await UpdateRoomPlayers(roomId);
        await BroadcastPlayerProgress(roomId);
    }

    public async Task ReportFinish(string roomId, string result)
    {
        var room = _roomManager.GetRoom(roomId);
        if (room == null || room.Status != GameStatus.Playing) return;

        var player = room.Players.FirstOrDefault(p => p.ConnectionId == Context.ConnectionId);
        if (player == null || player.Status != PlayerStatus.Playing) return;

        player.Status = result.Equals("won", StringComparison.OrdinalIgnoreCase)
            ? PlayerStatus.Won
            : PlayerStatus.Lost;

        if (room.GameStartedAt.HasValue)
        {
            player.FinishTimeMs = (long)(DateTime.UtcNow - room.GameStartedAt.Value).TotalMilliseconds;
        }

        await BroadcastPlayerProgress(roomId);

        if (room.Players.All(p => p.Status != PlayerStatus.Playing))
        {
            AssignPlaces(room);
            room.Status = GameStatus.Finished;
            await Clients.Group(roomId).SendAsync("GameOver", BuildGameOverPayload(room));
        }
    }

    public async Task StartNewGame(string roomId, int difficulty = 5)
    {
        var room = _roomManager.GetRoom(roomId);
        if (room == null)
        {
            await Clients.Caller.SendAsync("Error", "Комната не найдена");
            return;
        }

        if (room.HostConnectionId != Context.ConnectionId)
        {
            await Clients.Caller.SendAsync("Error", "Только создатель комнаты может начать игру");
            return;
        }

        if (room.Status == GameStatus.Playing)
        {
            await Clients.Caller.SendAsync("Error", "Игра уже началась");
            return;
        }

        var board = await _sudokuService.StartNewGameAsync(difficulty);
        if (board == null)
        {
            await Clients.Caller.SendAsync("Error", "Не удалось создать игру");
            return;
        }

        room.Task = board.Task;
        room.Solution = board.Solution;
        room.Difficulty = difficulty;
        room.TotalEmptyCells = CountEmptyCells(board.Task);
        room.GameStartedAt = DateTime.UtcNow;
        room.Status = GameStatus.Playing;

        foreach (var player in room.Players)
        {
            player.FilledCells = 0;
            player.MistakeCount = 0;
            player.Status = PlayerStatus.Playing;
            player.FinishTimeMs = null;
            player.Place = null;
        }

        await Clients.Group(roomId).SendAsync("GameStarted", BuildGamePayload(room));
        await BroadcastPlayerProgress(roomId);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var roomId = _roomManager.FindRoomIdByConnection(Context.ConnectionId);
        _roomManager.RemovePlayer(Context.ConnectionId);

        if (roomId != null)
        {
            await BroadcastPlayerProgress(roomId);
        }

        await base.OnDisconnectedAsync(exception);
    }

    private async Task BroadcastPlayerProgress(string roomId)
    {
        var room = _roomManager.GetRoom(roomId);
        if (room == null) return;

        await Clients.Group(roomId).SendAsync("UpdatePlayerProgress", BuildProgressPayload(room));
    }

    private static void AssignPlaces(GameRoom room)
    {
        var place = 1;

        foreach (var player in room.Players
                     .Where(p => p.Status == PlayerStatus.Won)
                     .OrderBy(p => p.FinishTimeMs ?? long.MaxValue))
        {
            player.Place = place++;
        }

        foreach (var player in room.Players
                     .Where(p => p.Status == PlayerStatus.Lost)
                     .OrderBy(p => p.FinishTimeMs ?? long.MaxValue))
        {
            player.Place = place++;
        }
    }

    private static object BuildGamePayload(GameRoom room) => new
    {
        task = room.Task,
        difficulty = room.Difficulty,
        totalEmptyCells = room.TotalEmptyCells,
    };

    private static object BuildProgressPayload(GameRoom room) => new
    {
        totalEmptyCells = room.TotalEmptyCells,
        players = room.Players.Select(p => new
        {
            name = p.Name,
            filledCells = p.FilledCells,
            mistakeCount = p.MistakeCount,
            status = p.Status.ToString().ToLowerInvariant(),
            finishTimeMs = p.FinishTimeMs,
            place = p.Place,
        }),
    };

    private static object BuildGameOverPayload(GameRoom room) => new
    {
        rankings = room.Players
            .Where(p => p.Place.HasValue)
            .OrderBy(p => p.Place)
            .Select(p => new
            {
                name = p.Name,
                place = p.Place,
                status = p.Status.ToString().ToLowerInvariant(),
                finishTimeMs = p.FinishTimeMs,
                filledCells = p.FilledCells,
                mistakeCount = p.MistakeCount,
            }),
    };

    private static int CountEmptyCells(int[][] task) =>
        task.SelectMany(row => row).Count(cell => cell == 0);
}
