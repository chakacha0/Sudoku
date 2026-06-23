using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sudoku.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddScoreInUserTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TotalXP",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalXP",
                table: "Users");
        }
    }
}
