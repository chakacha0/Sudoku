using System.Data;

public interface ISudokuDbContext
{
    IDbConnection CreateConnection();
}