using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class addContainerRule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "containerRules",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    product_type_id = table.Column<int>(type: "integer", nullable: false),
                    container_id = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_container_rules", x => x.id);
                    table.ForeignKey(
                        name: "fk_container_rules_containers_container_id",
                        column: x => x.container_id,
                        principalTable: "containers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_container_rules_product_types_product_type_id",
                        column: x => x.product_type_id,
                        principalTable: "ProductTypes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_container_rules_container_id",
                table: "containerRules",
                column: "container_id");

            migrationBuilder.CreateIndex(
                name: "ix_container_rules_product_type_id",
                table: "containerRules",
                column: "product_type_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "containerRules");
        }
    }
}
