using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "containerTypes",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_container_types", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "ProductTypes",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_product_types", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    surname = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    middlename = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    role = table.Column<int>(type: "integer", nullable: false),
                    identifier = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    registration_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    is_approved = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_users", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    product_type_id = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    capacity = table.Column<double>(type: "double precision", nullable: false),
                    expiration_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    manufacture_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_products", x => x.id);
                    table.ForeignKey(
                        name: "fk_products_product_types_product_type_id",
                        column: x => x.product_type_id,
                        principalTable: "ProductTypes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "containers",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    type_id = table.Column<int>(type: "integer", nullable: false),
                    product_id = table.Column<int>(type: "integer", nullable: true),
                    name = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    capacity = table.Column<double>(type: "double precision", nullable: false),
                    current_capacity = table.Column<double>(type: "double precision", nullable: false),
                    description = table.Column<string>(type: "varchar(250)", maxLength: 250, nullable: false),
                    status = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    last_modified_by = table.Column<int>(type: "integer", nullable: true),
                    last_modified_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_containers", x => x.id);
                    table.ForeignKey(
                        name: "fk_containers_container_types_type_id",
                        column: x => x.type_id,
                        principalTable: "containerTypes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_containers_products_product_id",
                        column: x => x.product_id,
                        principalTable: "Products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "ContainerHistories",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    container_id = table.Column<int>(type: "integer", nullable: false),
                    product_id = table.Column<int>(type: "integer", nullable: true),
                    action = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    user_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_container_histories", x => x.id);
                    table.ForeignKey(
                        name: "fk_container_histories_containers_container_id",
                        column: x => x.container_id,
                        principalTable: "containers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_container_histories_products_product_id",
                        column: x => x.product_id,
                        principalTable: "Products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_container_histories_users_user_id",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_container_histories_container_id",
                table: "ContainerHistories",
                column: "container_id");

            migrationBuilder.CreateIndex(
                name: "ix_container_histories_product_id",
                table: "ContainerHistories",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "ix_container_histories_updated_at",
                table: "ContainerHistories",
                column: "updated_at");

            migrationBuilder.CreateIndex(
                name: "ix_container_histories_user_id",
                table: "ContainerHistories",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_containers_product_id",
                table: "containers",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "ix_containers_type_id",
                table: "containers",
                column: "type_id");

            migrationBuilder.CreateIndex(
                name: "ix_container_types_name",
                table: "containerTypes",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_products_product_type_id",
                table: "Products",
                column: "product_type_id");

            migrationBuilder.CreateIndex(
                name: "ix_product_types_name",
                table: "ProductTypes",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_users_email",
                table: "Users",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_users_identifier",
                table: "Users",
                column: "identifier",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContainerHistories");

            migrationBuilder.DropTable(
                name: "containers");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "containerTypes");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "ProductTypes");
        }
    }
}
