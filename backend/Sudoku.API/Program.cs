
using Sudoku.Core.Interfaces;
using Sudoku.Core.Services;

var builder = WebApplication.CreateBuilder(args);

// --- 1. РЕГИСТРАЦИЯ СЕРВИСОВ (DI Container) ---

// Добавляем поддержку контроллеров (чтобы работал SudokuController)
builder.Services.AddControllers();

// Регистрация твоих сервисов Судоку
builder.Services.AddScoped<ISudokuGenerator, SudokuGenerator>();
builder.Services.AddScoped<ISudokuValidator, SudokuValidator>();
builder.Services.AddScoped<ISudokuSolver, SudokuSolver>(); 

// Настройка Swagger/OpenAPI (документация API)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Настройка CORS (чтобы React-фронтенд мог достучаться до API)
builder.Services.AddCors(options => {
    options.AddPolicy("AllowReactApp", policy => {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

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