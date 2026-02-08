using Domain.ContainerHistories;
using Domain.Containers;
using Domain.Products;
using Domain.Users; // Не забудь підключити юзерів!
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configuration
{
    public class ContainerHistoryConfiguration : IEntityTypeConfiguration<ContainerHistory>
    {
        public void Configure(EntityTypeBuilder<ContainerHistory> builder)
        {
            builder.ToTable("ContainerHistories");

            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();

            builder.HasOne(x => x.Container)
                .WithMany()
                .HasForeignKey(x => x.ContainerId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.Product)
                .WithMany()
                .HasForeignKey(x => x.ProductId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            /*            builder.HasOne<Container>()
                            .WithMany()
                            .HasForeignKey(x => x.ContainerId)
                            .IsRequired()
                            .OnDelete(DeleteBehavior.Cascade);


                        builder.HasOne<Product>()
                            .WithMany()
                            .HasForeignKey(x => x.ProductId)
                            .IsRequired(false)
                            .OnDelete(DeleteBehavior.Restrict);*/

            builder.HasOne<User>()
                .WithMany()
                .HasForeignKey(x => x.UserId) 
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.Action)
                .HasMaxLength(500)
                .IsRequired();

            builder.Property(x => x.UpdatedAt)
                .IsRequired();

            builder.HasIndex(x => x.ContainerId);
            builder.HasIndex(x => x.ProductId);
            builder.HasIndex(x => x.UserId);
            builder.HasIndex(x => x.UpdatedAt);
        }
    }
}