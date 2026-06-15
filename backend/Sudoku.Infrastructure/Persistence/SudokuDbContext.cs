using Microsoft.EntityFrameworkCore;
using Sudoku.Core.Models;

namespace Sudoku.Infrastructure.Persistence;

// 
public class SudokuDbContext : DbContext
{
    public SudokuDbContext(DbContextOptions<SudokuDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique(); 
            entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
        });
    }
}