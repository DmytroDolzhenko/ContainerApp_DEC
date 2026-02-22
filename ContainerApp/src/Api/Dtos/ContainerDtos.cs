using Domain.Containers;

namespace Api.Dtos
{
    public record ContainerDto(
        int Id,
        string Name,
        string Description,
        double Capacity,
        double CurrentCapacity,
        int ContainerTypeId,
        string ContainerTypeName,
        int? ProductId,
        string? ProductName,
        string UniqCode,
        DateTime CreatedAt
        )
    {
        public static ContainerDto FromDomain(Container container)
                => new(container.Id,
                    container.Name,
                    container.Description,
                    container.Capacity,
                    container.CurrentCapacity,
                    container.TypeId,
                    container.Type?.Name,
                    container.ProductId,
                    container.Product?.Name,
                    container.UniqCode,
                    container.CreatedAt);
    }

    public record CreateContainerDto(
        string Name,
        string? Description,
        int ContainerTypeId
        );
    public record UpdateContainerDto(
        string Name,
        string Description,
        string ContainerTypeName
        );

    public record FillContainerDto(
        int ProductId,
        int Amount
        );

    public record AddRuleDto(
        int ProductTypeId
        );

    public record RemoveRuleDto(
        int RuleId
        );
}
