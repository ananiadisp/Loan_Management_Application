CREATE NONCLUSTERED INDEX IX_Payments_LoanID
ON CoreLoan.Payments (LoanID);
GO

CREATE NONCLUSTERED INDEX IX_LoanApplications_CustomerID_Status
ON LoanApp.LoanApplications (CustomerID, ApplicationStatus);
GO