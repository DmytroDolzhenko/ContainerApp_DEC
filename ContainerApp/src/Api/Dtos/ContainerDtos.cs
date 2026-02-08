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
        string? ProductName
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
                    container.Product?.Name);
    }

    public record CreateContainerDto(
        string Name,
        double Capacity,
        string Description,
        int ContainerTypeId
        );
    public record UpdateContainerDto(
        string Name,
        double Capacity,
        string Description
        );

    public record FillContainerDto(
        int ProductId,
        int Amount
        );
}
