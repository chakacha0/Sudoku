using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sudoku.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDifficultInBoard : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Difficulty",
                table: "Boards",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Difficulty",
                table: "Boards");
        }
    }
}
