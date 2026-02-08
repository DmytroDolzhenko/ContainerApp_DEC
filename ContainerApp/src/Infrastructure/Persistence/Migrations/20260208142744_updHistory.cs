using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class updHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_container_histories_containers_container_id1",
                table: "ContainerHistories");

            migrationBuilder.DropForeignKey(
                name: "fk_container_histories_products_product_id1",
                table: "ContainerHistories");

            migrationBuilder.DropIndex(
                name: "ix_container_histories_container_id1",
                table: "ContainerHistories");

            migrationBuilder.DropIndex(
                name: "ix_container_histories_product_id1",
                table: "ContainerHistories");

            migrationBuilder.DropColumn(
                name: "container_id1",
                table: "ContainerHistories");

            migrationBuilder.DropColumn(
                name: "product_id1",
                table: "ContainerHistories");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "container_id1",
                table: "ContainerHistories",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "product_id1",
                table: "ContainerHistories",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_container_histories_container_id1",
                table: "ContainerHistories",
                column: "container_id1");

            migrationBuilder.CreateIndex(
                name: "ix_container_histories_product_id1",
                table: "ContainerHistories",
                column: "product_id1");

            migrationBuilder.AddForeignKey(
                name: "fk_container_histories_containers_container_id1",
                table: "ContainerHistories",
                column: "container_id1",
                principalTable: "containers",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_container_histories_products_product_id1",
                table: "ContainerHistories",
                column: "product_id1",
                principalTable: "Products",
                principalColumn: "id");
        }
    }
}
