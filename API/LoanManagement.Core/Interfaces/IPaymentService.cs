﻿using LoanManagement.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManagement.Core.Interfaces
{
    public interface IPaymentService
    {
        Task<int> SubmitPayment(CreatePaymentDto createPaymentDto);
    }
}
