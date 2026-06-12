using Dapper;

namespace Sudoku.Infrastructure.Persistence;

public static class DbInitializer
{
    public static async Task InitializeAsync(ISudokuDbContext context)
    {
        using var connection = context.CreateConnection();

        // SQL запрос, который создает таблицу только если её нет
        const string sql = @"
            CREATE TABLE IF NOT EXISTS boards (
                id UUID PRIMARY KEY,
                solution JSONB NOT NULL,
                task JSONB NOT NULL,
                difficulty VARCHAR(20),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );";

        // Можно добавить создание других таблиц здесь (например, users)
        
        await connection.ExecuteAsync(sql);
    }
}