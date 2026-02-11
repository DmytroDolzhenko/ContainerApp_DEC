using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ComptibilityUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "pk_container_type_product_types",
                table: "ContainerTypeProductTypes");

            migrationBuilder.DropIndex(
                name: "ix_container_type_product_types_container_type_id",
                table: "ContainerTypeProductTypes");

            migrationBuilder.AddColumn<int>(
                name: "id",
                table: "ContainerTypeProductTypes",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "pk_container_type_product_types",
                table: "ContainerTypeProductTypes",
                column: "id");

            migrationBuilder.CreateIndex(
                name: "ix_container_type_product_types_container_type_id_product_type_id",
                table: "ContainerTypeProductTypes",
                columns: new[] { "container_type_id", "product_type_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_container_type_product_types_product_type_id",
                table: "ContainerTypeProductTypes",
                column: "product_type_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "pk_container_type_product_types",
                table: "ContainerTypeProductTypes");

            migrationBuilder.DropIndex(
                name: "ix_container_type_product_types_container_type_id_product_type_id",
                table: "ContainerTypeProductTypes");

            migrationBuilder.DropIndex(
                name: "ix_container_type_product_types_product_type_id",
                table: "ContainerTypeProductTypes");

            migrationBuilder.DropColumn(
                name: "id",
                table: "ContainerTypeProductTypes");

            migrationBuilder.AddPrimaryKey(
                name: "pk_container_type_product_types",
                table: "ContainerTypeProductTypes",
                columns: new[] { "product_type_id", "container_type_id" });

            migrationBuilder.CreateIndex(
                name: "ix_container_type_product_types_container_type_id",
                table: "ContainerTypeProductTypes",
                column: "container_type_id");
        }
    }
}
