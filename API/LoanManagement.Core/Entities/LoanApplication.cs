using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManagement.Core.Entities
{
    public class LoanApplication
    {
        public int ApplicationID { get; set; }
        public int CustomerID { get; set; }
        public int LoanProductID { get; set; }
        public decimal RequestedAmount { get; set; }
        public DateTime ApplicationDate { get; set; } = DateTime.Now;
        public string ApplicationStatus { get; set; } = "Pending";
        public int? AssignedEmployeeID { get; set; }
        public DateTime? DecisionDate { get; set; }
        public decimal? ApprovedAmount { get; set; }
        public string RejectionReason { get; set; } = null!;

        public Customer Customer { get; set; } = null!;
        public LoanProduct LoanProduct { get; set; } = null!;
        public Employee AssignedEmployee { get; set; } = null!;
    }
}
