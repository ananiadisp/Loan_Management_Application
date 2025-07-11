using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManagement.Core.DTOs
{
    public class LoanProductDto
    {
        public int LoanProductID { get; set; }
        public string ProductName { get; set; } = null!;
    }
}
