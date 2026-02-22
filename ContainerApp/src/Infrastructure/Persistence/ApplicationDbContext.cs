using Domain.ContainerHistories;
using Domain.ContainerRules;
using Domain.Containers;
using Domain.ContainerTypeProductTypes;
using Domain.ContainerTypes;
using Domain.Products;
using Domain.ProductTypes;
using Domain.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : IdentityDbContext<User, IdentityRole<int>, int>(options)
    {
        public DbSet<Container> Containers { get; init; }
        public DbSet<ContainerType> ContainerTypes { get; init; }
        public DbSet<ContainerHistory> ContainerHistory { get; init; }
       // public DbSet<User> Users { get; init; }
        public DbSet<Product> Products { get; init; }
        public DbSet<ProductType> ProductTypes { get; init; }
        public DbSet<ContainerTypeProductType> ContainerTypeProductType { get; init; }
        public DbSet<ContainerRule> ContainerRules { get; init; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            /*  modelBuilder.Entity<Container>()
          .HasQueryFilter(c => !c.IsDeleted);

              modelBuilder.Entity<Product>()
          .HasQueryFilter(c => !c.IsDeleted);*/

            modelBuilder.Entity<Container>()
                .Ignore(c => c.Capacity);

            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}
