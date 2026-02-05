using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Products;
using Microsoft.EntityFrameworkCore;
using System;

namespace Infrastructure.Persistence.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly ApplicationDbContext _context;

    public ProductRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    /*public async Task<Product> AddAsync(Product entity, CancellationToken cancellationToken)
    {
        await _context.Products.AddAsync(entity, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return entity;
    }

    public async Task<Product> UpdateAsync(Product entity, CancellationToken cancellationToken)
    {
        _context.Products.Update(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity;
    }

    public async Task<Product> DeleteAsync(Product entity, CancellationToken cancellationToken)
    {
        _context.Products.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity;
    }*/

}