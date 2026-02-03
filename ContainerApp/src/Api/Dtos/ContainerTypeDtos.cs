using Domain.ContainerTypes;

namespace Api.Dtos
{
    public record ContainerTypeDtos(
        int Id,
        string Name
        )
    {
        public static ContainerTypeDtos FromDomain(ContainerType containerType)
                => new(containerType.Id,
                    containerType.Name);
    }
    public record CreateContainerTypeDto(string Name);
    public record UpdateContainerTypeDto(string Name);
}
