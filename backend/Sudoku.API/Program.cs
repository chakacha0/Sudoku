
using Dapper; // Не забудь добавить вверху
using Sudoku.Core.Interfaces;
using Sudoku.Core.Services;
using Sudoku.Infrastructure.Persistence; 




var builder = WebApplication.CreateBuilder(args);

// --- 1. РЕГИСТРАЦИЯ СЕРВИСОВ (DI Container) ---

// Добавляем поддержку контроллеров (чтобы работал SudokuController)
builder.Services.AddControllers();

// Регистрация твоих сервисов Судоку
builder.Services.AddScoped<ISudokuGenerator, SudokuGenerator>();
builder.Services.AddScoped<ISudokuValidator, SudokuValidator>();
builder.Services.AddScoped<ISudokuSolver, SudokuSolver>(); 
builder.Services.AddScoped<ISudokuDbContext, SudokuDbContext>();

// Настройка Swagger/OpenAPI (документация API)
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Настройка CORS (чтобы React-фронтенд мог достучаться до API)
builder.Services.AddCors(options => {
    options.AddPolicy("AllowReactApp", policy => {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

// using (var scope = app.Services.CreateScope())
// {
//     var context = scope.ServiceProvider.GetRequiredService<ISudokuDbContext>();
//     try 
//     {
//         await DbInitializer.InitializeAsync(context);
//         Console.WriteLine("База данных успешно проверена/инициализирована.");
//     }
//     catch (Exception ex)
//     {
//         Console.WriteLine($"Ошибка при инициализации базы: {ex.Message}");
//     }
// }

app.MapGet("/test-db", async (ISudokuDbContext context) =>
{
    try
    {
        using var connection = context.CreateConnection();
        // Выполняем простейший запрос к Postgres
        var result = await connection.ExecuteScalarAsync<string>("SELECT version();");
        return Results.Ok(new { Message = "Успешное подключение!", Version = result });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Ошибка подключения: {ex.Message}");
    }
});

// --- 2. НАСТРОЙКА КОНВЕЙЕРА (Middleware) ---

// Включаем Swagger, чтобы тестировать запросы через браузер
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

// Включаем политику CORS
app.UseCors("AllowReactApp");

// Говорим приложению искать контроллеры в папке Controllers
app.MapControllers();

app.Run();