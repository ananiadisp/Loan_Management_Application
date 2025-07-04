using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManagement.Core.Entities
{
    public class Payment
    {
        public int PaymentID { get; set; }
        public int LoanID { get; set; }
        public DateTime PaymentDate { get; set; } = DateTime.Now;
        public decimal PaymentAmount { get; set; }
        public string PaymentType { get; set; } = null!;
        public int? RecordedByEmployeeID { get; set; }

        public Loan Loan { get; set; } = null!;
        public Employee RecordedByEmployee { get; set; } = null!;
    }
}
