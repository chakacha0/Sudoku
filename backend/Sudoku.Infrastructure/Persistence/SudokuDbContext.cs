using System.Data;
using Microsoft.Extensions.Configuration;
using Npgsql;

public class SudokuDbContext : ISudokuDbContext
{
    private readonly IConfiguration _configuration;
    private readonly string _connectionString;

    public SudokuDbContext(IConfiguration configuration)
    {
        _configuration = configuration;
        // Берем строку из секции ConnectionStrings:DefaultConnection
        _connectionString = _configuration.GetConnectionString("DefaultConnection") 
                            ?? throw new ArgumentNullException("Connection string not found");
    }

    public IDbConnection CreateConnection() 
        => new NpgsqlConnection(_connectionString);
}