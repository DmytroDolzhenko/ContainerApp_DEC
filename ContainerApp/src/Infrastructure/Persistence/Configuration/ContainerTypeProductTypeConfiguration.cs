using Domain.ContainerTypeProductTypes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Configuration
{
    public class ContainerTypeProductTypeConfiguration : IEntityTypeConfiguration<ContainerTypeProductType>
    {
        public void Configure(EntityTypeBuilder<ContainerTypeProductType> builder)
        {
          builder.ToTable("ContainerTypeProductTypes");

            builder.HasKey(x => x.Id);

            builder.HasIndex(x => new { x.ContainerTypeId, x.ProductTypeId }).IsUnique();

            builder.HasOne(x => x.ProductType)
                .WithMany()
                .HasForeignKey(x => x.ProductTypeId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.ContainerType)
                .WithMany()
                .HasForeignKey(x => x.ContainerTypeId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
