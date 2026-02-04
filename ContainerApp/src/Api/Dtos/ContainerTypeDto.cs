using Domain.ContainerTypes;

namespace Api.Dtos
{
    public record ContainerTypeDto(
        int Id,
        string Name
        )
    {
        public static ContainerTypeDto FromDomain(ContainerType containerType)
                => new(containerType.Id,
                    containerType.Name);
    }
    public record CreateContainerTypeDto(string Name);
    public record UpdateContainerTypeDto(string Name);
}
