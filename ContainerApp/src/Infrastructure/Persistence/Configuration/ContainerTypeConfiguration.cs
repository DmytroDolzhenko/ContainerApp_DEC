using Domain.ContainerTypes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Configuration
{
    public class ContainerTypeConfiguration : IEntityTypeConfiguration<ContainerType>
    {
        public void Configure(EntityTypeBuilder<ContainerType> builder)
        {
            builder.ToTable("containerTypes");

            builder.HasKey(ct => ct.Id);

            builder.Property(ct => ct.Name)
                .IsRequired()
                .HasMaxLength(100);

            builder.HasIndex(ct => ct.Name)
                .IsUnique();

            builder.Property(ct => ct.CreatedAt)
                .IsRequired();

            builder.Property(ct => ct.UpdatedAt)
                .IsRequired(false);
        }
    }
}
