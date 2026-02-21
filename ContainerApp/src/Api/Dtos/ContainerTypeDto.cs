using Domain.ContainerTypes;

namespace Api.Dtos
{
    public record ContainerTypeDto(
        int Id,
        string Name,
        int Capacity
        )
    {
        public static ContainerTypeDto FromDomain(ContainerType containerType)
                => new(containerType.Id,
                    containerType.Name,
                    containerType.Capacity);
    }
    public record CreateContainerTypeDto(string Name, int Capacity);
    public record UpdateContainerTypeDto(string Name, int Capacity);
}
