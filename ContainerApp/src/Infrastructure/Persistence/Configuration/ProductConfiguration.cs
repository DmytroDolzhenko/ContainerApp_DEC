using Domain.Products;
using Domain.ProductTypes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id).ValueGeneratedOnAdd();

        builder.HasOne(x => x.ProductType)
               .WithMany(t => t.Products)
               .HasForeignKey(x => x.ProductTypeId)
               .IsRequired()
               .OnDelete(DeleteBehavior.Restrict);

        builder.Navigation(x => x.ProductType).AutoInclude();

        builder.Property(x => x.Name)
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(x => x.Description)
            .HasMaxLength(1000);

        builder.Property(x => x.ExpirationDate)
            .IsRequired();

        builder.Property(x => x.ManufactureDate)
            .IsRequired(false);

        builder.ToTable("Products");
    }
}