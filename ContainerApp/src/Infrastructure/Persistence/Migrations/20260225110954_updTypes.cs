using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class updTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_product_types_name",
                table: "ProductTypes");

            migrationBuilder.DropIndex(
                name: "ix_container_types_name",
                table: "containerTypes");

            migrationBuilder.CreateIndex(
                name: "ix_product_types_name",
                table: "ProductTypes",
                column: "name");

            migrationBuilder.CreateIndex(
                name: "ix_container_types_name",
                table: "containerTypes",
                column: "name");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_product_types_name",
                table: "ProductTypes");

            migrationBuilder.DropIndex(
                name: "ix_container_types_name",
                table: "containerTypes");

            migrationBuilder.CreateIndex(
                name: "ix_product_types_name",
                table: "ProductTypes",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_container_types_name",
                table: "containerTypes",
                column: "name",
                unique: true);
        }
    }
}
