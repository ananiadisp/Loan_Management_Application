using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManagement.Core.Entities
{
    public class LoanProduct
    {
        public int LoanProductID { get; set; }
        public string ProductName { get; set; } = null!;
        public string Description { get; set; } = null!;
        public decimal InterestRate { get; set; }
        public decimal MaxLoanAmount { get; set; }
        public int MinCreditScore { get; set; }
        public int MinTermMonths { get; set; }
        public int MaxTermMonths { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
