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