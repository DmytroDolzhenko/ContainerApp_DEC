using Domain.ContainerHistories;
using Domain.Containers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Configuration
{
    public class ContainerHistoryConfiguration : IEntityTypeConfiguration<ContainerHistory>
    {
        public void Configure(EntityTypeBuilder<ContainerHistory> builder)
        {
            builder.ToTable("containerHistories");

            builder.HasKey(x => x.Id);

            builder.HasOne<Container>()
                .WithMany()
                .HasForeignKey(x => x.ContainerId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Property(x => x.Action)
                .HasColumnType("varchar(500)")
                .IsRequired();

            builder.Property(x => x.UpdatedAt)
                .IsRequired();

            builder.HasIndex(x => x.ContainerId);
            builder.HasIndex(x => x.UpdatedAt);
        }
    }
}
