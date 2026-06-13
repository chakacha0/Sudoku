using Microsoft.EntityFrameworkCore;

namespace Sudoku.Infrastructure.Persistence;

// Наследуемся от DbContext — это "сердце" Entity Framework
public class SudokuDbContext : DbContext
{
    public SudokuDbContext(DbContextOptions<SudokuDbContext> options)
        : base(options)
    {
    }

    // Пока здесь пусто, таблиц нет, но для проверки подключения этого достаточно
}