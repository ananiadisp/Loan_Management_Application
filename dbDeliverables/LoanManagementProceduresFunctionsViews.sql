USE LoanManagementDB2025;
GO

-- Stored Procedure: Approve Loan Application
-- Validates customer credit score vs. product minimum, updates application status, inserts into Loans if approved.
CREATE PROCEDURE LoanApp.sp_ApproveLoanApplication
    @ApplicationID INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @CustomerID INT, @LoanProductID INT, @CreditScore INT, @MinCreditScore INT;
    DECLARE @ApprovedAmount MONEY, @InterestRate DECIMAL(5,3), @TermMonths INT;
    DECLARE @Now DATE = GETDATE();

    SELECT 
        @CustomerID = la.CustomerID,
        @LoanProductID = la.LoanProductID,
        @ApprovedAmount = la.RequestedAmount
    FROM LoanApp.LoanApplications la
    WHERE la.ApplicationID = @ApplicationID;

    SELECT @CreditScore = c.CreditScore
    FROM CoreLoan.Customers c
    WHERE c.CustomerID = @CustomerID;

    SELECT 
        @MinCreditScore = lp.MinCreditScore,
        @InterestRate = lp.InterestRate,
        @TermMonths = lp.MinTermMonths
    FROM Reference.LoanProducts lp
    WHERE lp.LoanProductID = @LoanProductID;

    IF @CreditScore >= @MinCreditScore
    BEGIN
        UPDATE LoanApp.LoanApplications
        SET ApplicationStatus = 'Approved',
            ApprovedAmount = @ApprovedAmount,
            DecisionDate = @Now
        WHERE ApplicationID = @ApplicationID;

        INSERT INTO CoreLoan.Loans (
            ApplicationID, CustomerID, LoanProductID, ApprovedAmount,
            DisbursementDate, MaturityDate, InterestRate,
            CurrentBalance, OriginalTermMonths, LoanStatus
        )
        VALUES (
            @ApplicationID, @CustomerID, @LoanProductID, @ApprovedAmount,
            @Now, DATEADD(MONTH, @TermMonths, @Now), @InterestRate,
            @ApprovedAmount, @TermMonths, 'Active'
        );
    END
    ELSE
    BEGIN
        UPDATE LoanApp.LoanApplications
        SET ApplicationStatus = 'Rejected',
            DecisionDate = @Now,
            RejectionReason = 'Credit score below required threshold'
        WHERE ApplicationID = @ApplicationID;
    END
END;
GO

-- Function: Calculate Monthly Installment
-- Computes monthly payment using the amortization formula.
CREATE FUNCTION CoreLoan.fn_CalculateMonthlyInstallment
(
    @Principal MONEY,
    @AnnualInterestRate DECIMAL(5,3),
    @TermMonths INT
)
RETURNS MONEY
AS
BEGIN
    DECLARE @MonthlyRate DECIMAL(10,8) = @AnnualInterestRate / 12 / 100;
    DECLARE @Installment MONEY;

    IF @MonthlyRate = 0
        SET @Installment = @Principal / @TermMonths;
    ELSE
        SET @Installment = @Principal * (@MonthlyRate * POWER(1 + @MonthlyRate, @TermMonths)) 
                         / (POWER(1 + @MonthlyRate, @TermMonths) - 1);

    RETURN ROUND(@Installment, 2);
END;
GO

-- View: Loan Summary
-- Shows total paid, last payment, outstanding balance, and loan status for each loan.
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