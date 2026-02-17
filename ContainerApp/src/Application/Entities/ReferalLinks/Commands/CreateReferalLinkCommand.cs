using Application.Common.Interfaces.Repositories;
using Domain.ReferalLinks;
using MediatR;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Entities.ReferalLinks.Commands
{
    public record class CreateReferalLinkCommand : IRequest<string>
    {
        public int AdminId { get; set; }
    }

    public class CreateReferalLinkCommandHandler(IEntityRepository<ReferalLink> repository) : IRequestHandler<CreateReferalLinkCommand, string>
    {
        public async Task<string> Handle(CreateReferalLinkCommand request, CancellationToken cancellationToken)
        {
            var token = Guid.NewGuid().ToString("N");

            var referalLink = new ReferalLink
            {
                Token = token,
                CreateBy = request.AdminId,
                ExpiresAt = DateTime.UtcNow.AddHours(1),
                IsUsed = false
            };

            await repository.AddAsync(referalLink, cancellationToken);

            var baseUrl = "https://localhost:7217";

            return $"{baseUrl}?token={token}";
        }
    }
}
