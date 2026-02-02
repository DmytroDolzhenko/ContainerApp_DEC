using Domain.ContainerHistories;
using Domain.Containers;
using Domain.ContainerTypes;
using Domain.Products;
using Domain.ProductTypes;
using Domain.Users;
using LanguageExt.Pipes;
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
        : DbContext(options)
    {
        public DbSet<Container> Containers { get; init; }
        public DbSet<ContainerType> ContainerTypes { get; init; }
        public DbSet<ContainerHistory> ContainerHistory { get; init; }
        public DbSet<User> Users { get; init; }
        public DbSet<Product> Products { get; init; }
        public DbSet<ProductType> ProductTypes { get; init; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
            base.OnModelCreating(modelBuilder);
        }
    }
}
