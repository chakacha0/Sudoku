using Sudoku.Core.Interfaces;
using Sudoku.Core.Services;
using Sudoku.Core.Models;
using Microsoft.EntityFrameworkCore; 
using Microsoft.AspNetCore.Authentication.JwtBearer; 
using Microsoft.IdentityModel.Tokens;
using Sudoku.Infrastructure.Authentication; 
using Sudoku.Infrastructure.Persistence;
using Sudoku.Infrastructure.Repositories;
using System.Text;
var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");


builder.Services.AddControllers();
builder.Services.AddScoped<ISudokuGenerator, SudokuGenerator>();
builder.Services.AddScoped<ISudokuValidator, SudokuValidator>();
builder.Services.AddScoped<ISudokuSolver, SudokuSolver>(); 
builder.Services.AddDbContext<SudokuDbContext>(options =>
    options.UseNpgsql(connectionString));
 
builder.Services.AddScoped<ISudokuService, SudokuService>();
builder.Services.AddScoped<ISudokuRepository, SudokuRepository>();

builder.Services.AddScoped<IGameService, GameService>();
builder.Services.AddScoped<IGameRepository, GameRepository>();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<IJwtProvider, JwtProvider>();


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"]!))
        };
    });

builder.Services.AddAuthorization();


builder.Services.AddCors(options => {
    options.AddPolicy("AllowReactApp", policy => {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<SudokuDbContext>();
        
        
        await context.Database.MigrateAsync();
        
        Console.WriteLine("--- МИГРАЦИИ УСПЕШНО ПРИМЕНЕНЫ ---");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"--- ОШИБКА ПРИ ПРИМЕНЕНИИ МИГРАЦИЙ: {ex.Message} ---");
        
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();

app.UseAuthorization();

app.UseCors("AllowReactApp");

app.MapControllers();

app.Run();