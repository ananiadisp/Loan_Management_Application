USE LoanManagementDB2025T5;
GO

-- ===============================
-- 1. Collect performance BEFORE indexing
-- ===============================
PRINT '=== BEFORE INDEXING ===';
SET STATISTICS IO, TIME ON;

-- Payments aggregation
SELECT LoanID, SUM(PaymentAmount) AS TotalPaid
FROM CoreLoan.Payments
GROUP BY LoanID;

-- Loan applications filter by customer and status
SELECT *
FROM LoanApp.LoanApplications
WHERE CustomerID = 4 AND ApplicationStatus = 'Pending';

SET STATISTICS IO, TIME OFF;
GO

-- ===============================
-- 2. Create Indexes
-- ===============================
PRINT 'Creating indexes...';

CREATE NONCLUSTERED INDEX IX_Payments_LoanID
ON CoreLoan.Payments (LoanID);
GO

CREATE NONCLUSTERED INDEX IX_LoanApplications_CustomerID_Status
ON LoanApp.LoanApplications (CustomerID, ApplicationStatus);
GO

-- Update statistics and reorganize indexes
EXEC sp_updatestats;
ALTER INDEX ALL ON LoanApp.LoanApplications REBUILD;
ALTER INDEX ALL ON CoreLoan.Payments REBUILD;
GO

-- ===============================
-- 3. Collect performance AFTER indexing
-- ===============================
PRINT '=== AFTER INDEXING ===';
SET STATISTICS IO, TIME ON;

-- Payments aggregation
SELECT LoanID, SUM(PaymentAmount) AS TotalPaid
FROM CoreLoan.Payments
GROUP BY LoanID;

-- Loan applications filter by customer and status
SELECT *
FROM LoanApp.LoanApplications
WHERE CustomerID = 4 AND ApplicationStatus = 'Pending';

SET STATISTICS IO, TIME OFF;
GO

PRINT 'Optimization script complete.';