using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ReferalLinks
{
    public class ReferalLink : IEntity
    {
        public int Id { get; set;  }
        public string Token { get; set; }
        public bool IsUsed { get; set; }
        public int CreateBy { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}
