using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManagement.Core.DTOs
{
    public class CreateLoanApplicationDto
    {
        public int CustomerId { get; set; }
        public int LoanProductId { get; set; }
        public decimal RequestedAmount { get; set; }
    }
}
