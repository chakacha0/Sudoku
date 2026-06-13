
using Sudoku.Core.Interfaces;
using Sudoku.Core.Services;
using Sudoku.Infrastructure.Persistence; 
using Microsoft.EntityFrameworkCore;



var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");


builder.Services.AddControllers();
builder.Services.AddScoped<ISudokuGenerator, SudokuGenerator>();
builder.Services.AddScoped<ISudokuValidator, SudokuValidator>();
builder.Services.AddScoped<ISudokuSolver, SudokuSolver>(); 
builder.Services.AddDbContext<SudokuDbContext>(options =>
    options.UseNpgsql(connectionString));


builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddOpenApi();


builder.Services.AddCors(options => {
    options.AddPolicy("AllowReactApp", policy => {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

app.MapGet("/test-db", async (SudokuDbContext db) =>
{
    try
    {
       
        bool canConnect = await db.Database.CanConnectAsync();
        
        if (canConnect)
            return Results.Ok(new { status = "Успех!", message = "Entity Framework видит базу данных Postgres" });
        
        return Results.Problem("Не удалось подключиться к базе данных.");
    }
    catch (Exception ex)
    {
        return Results.Problem($"Ошибка при попытке связи: {ex.Message}");
    }
});


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseCors("AllowReactApp");

app.MapControllers();

app.Run();