using Sudoku.Core.Interfaces;
using Sudoku.Core.Models;

namespace Sudoku.Core.Services;

public class SudokuService : ISudokuService
{
    private readonly ISudokuGenerator _generator;
    private readonly ISudokuRepository _repository;

    public SudokuService (ISudokuGenerator generator,ISudokuRepository repository)
    {
        _generator=generator;
        _repository=repository;
    }

    public async Task<Board?> StartNewGameAsync(int difficulty)
    {
        var board =_generator.Generate(difficulty);
        await _repository.AddAsync(board);
        return board;
    }

}