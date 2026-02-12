using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services
{
    public class ContainerCodeGenerator
    {
        public string GenerateUniqueCode(string type)
        {
            var year = DateTime.Now.ToString("yy");
            var randomPart = Guid.NewGuid().ToString("N").Substring(0, 4).ToUpper();
            return $"{type.ToUpper()}-{year}-{randomPart}";
        }
    }
}
