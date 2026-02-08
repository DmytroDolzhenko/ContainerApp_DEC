namespace Api.Dtos
{
    public record ContainerHistoryDto(
     int Id,
     int ContainerId,
     string? ContainerName,
     int? ProductId,
     string? ProductName,
     string Action,
     DateTime UpdatedAt,
     int UserId);
}
