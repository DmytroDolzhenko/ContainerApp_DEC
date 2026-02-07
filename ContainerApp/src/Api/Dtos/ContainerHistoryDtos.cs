namespace Api.Dtos
{
    public record ContainerHistoryDto(
     int Id,
     int ContainerId,
     int? ProductId,
     string Action,
     DateTime UpdatedAt,
     int UserId);
}
