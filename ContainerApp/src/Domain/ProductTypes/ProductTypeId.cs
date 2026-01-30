namespace Domain.ProductTypes
{
    public record ProductTypeId(Guid value)
    {
        public static ProductTypeId Empty() => new (Guid.Empty);
        public static ProductTypeId New() => new(Guid.NewGuid());
        public override string ToString() => value.ToString();

    }
}