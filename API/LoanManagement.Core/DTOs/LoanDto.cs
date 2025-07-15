using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManagement.Core.DTOs
{
    public class LoanDto
    {
        public int LoanId { get; set; }
        public int CustomerId { get; set; }
        public decimal ApprovedAmount { get; set; }
    }
}
