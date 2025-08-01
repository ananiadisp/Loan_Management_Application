﻿using LoanManagement.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManagement.Core.Interfaces
{
    public interface IPaymentRepository
    {
        Task<int> InsertPaymentAsync(Payment payment);
    }
}
