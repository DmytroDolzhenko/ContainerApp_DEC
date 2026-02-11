using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ProductContainerCompliance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ContainerTypeProductTypes",
                columns: table => new
                {
                    container_type_id = table.Column<int>(type: "integer", nullable: false),
                    product_type_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_container_type_product_types", x => new { x.product_type_id, x.container_type_id });
                    table.ForeignKey(
                        name: "fk_container_type_product_types_container_types_container_type_id",
                        column: x => x.container_type_id,
                        principalTable: "containerTypes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_container_type_product_types_product_types_product_type_id",
                        column: x => x.product_type_id,
                        principalTable: "ProductTypes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_container_type_product_types_container_type_id",
                table: "ContainerTypeProductTypes",
                column: "container_type_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContainerTypeProductTypes");
        }
    }
}
