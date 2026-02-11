using Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id)
            .ValueGeneratedOnAdd();

        builder.Property(x => x.Name)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(x => x.Surname)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(x => x.Middlename)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(x => x.Email)
            .HasMaxLength(255)
            .IsRequired();

        builder.HasIndex(x => x.Email)
            .IsUnique();

      /*  builder.Property(x => x.Identifier)
            .HasMaxLength(50)
            .IsRequired();

        builder.HasIndex(x => x.Identifier)
            .IsUnique();*/

        builder.Property(x => x.Role)
            .IsRequired();

        builder.Property(x => x.IsApproved)
            .IsRequired();

        builder.Property(x => x.RegistrationDate)
            .IsRequired(false);

        builder.ToTable("Users");
    }
}