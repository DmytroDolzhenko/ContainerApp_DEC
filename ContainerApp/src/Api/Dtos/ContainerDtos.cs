using Domain.Containers;

namespace Api.Dtos
{
    public record ContainerDto(
        int Id,
        string Name,
        int ContainerTypeId,
        int? ProductId
        )
    {
        public static ContainerDto FromDomain(Container container)
                => new(container.Id,
                    container.Name,
                    container.TypeId,
                    container.ProductId);
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
