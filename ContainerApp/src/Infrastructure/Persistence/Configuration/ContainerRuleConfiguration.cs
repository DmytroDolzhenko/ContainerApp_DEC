using Domain.ContainerRules;
using Domain.Containers;
using Domain.ContainerTypes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.Extensions.Logging.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Configuration
{
    public class ContainerRuleConfiguration : IEntityTypeConfiguration<ContainerRule>
    {
        public void Configure(EntityTypeBuilder<ContainerRule> builder)
        {
            builder.ToTable("containerRules");

            builder.HasKey(x => x.Id);

            builder.HasOne<Container>()
                   .WithMany(x => x.Rules)
                   .HasForeignKey(x => x.ContainerId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.ProductTypeForRule)
                   .WithMany()
                   .HasForeignKey(x => x.ProductTypeId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
