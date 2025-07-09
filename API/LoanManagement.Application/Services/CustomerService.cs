using LoanManagement.Core.Entities;
using LoanManagement.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManagement.Application.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _customerRepository;
        public CustomerService(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }
        public Task<IEnumerable<Customer>> GetAllAsync()
        {
            return _customerRepository.GetAllAsync();
        }
    }
}
