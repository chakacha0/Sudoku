using Microsoft.EntityFrameworkCore;
using Sudoku.Core.Models;
using System.Text.Json;

namespace Sudoku.Infrastructure.Persistence;

// 
public class SudokuDbContext : DbContext
{
    public SudokuDbContext(DbContextOptions<SudokuDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Board> Boards {get; set; }
    public DbSet<Game> Games {get; set;}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique(); 
            entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
        });

        modelBuilder.Entity<Board>(entity =>
        {
            entity.HasKey(e=>e.Id);

            entity.Property(e => e.Solution)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<int[][]>(v, (JsonSerializerOptions?)null) ?? new int[9][]
                );

           
            entity.Property(e => e.Task)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<int[][]>(v, (JsonSerializerOptions?)null)! ?? new int[9][]
                );
        });

        modelBuilder.Entity<Game>(entity =>
        {
            entity.HasKey(e=>e.Id);

            entity.HasOne<User>()
                  .WithMany()
                  .HasForeignKey(e => e.UserId);

            entity.HasOne<Board>()
                  .WithMany()
                  .HasForeignKey(e => e.BoardId);
        });
    }

     
}