CREATE VIEW CoreLoan.vw_LoanSummary AS
SELECT
    l.LoanID,
    c.FirstName + ' ' + c.LastName AS CustomerName,
    SUM(p.PaymentAmount) AS TotalPaid,
    MAX(p.PaymentDate) AS LastPaymentDate,
    l.CurrentBalance AS OutstandingBalance,
    l.LoanStatus
FROM CoreLoan.Loans l
LEFT JOIN CoreLoan.Payments p ON l.LoanID = p.LoanID
INNER JOIN CoreLoan.Customers c ON l.CustomerID = c.CustomerID
GROUP BY
    l.LoanID, c.FirstName, c.LastName, l.CurrentBalance, l.LoanStatus;
GO