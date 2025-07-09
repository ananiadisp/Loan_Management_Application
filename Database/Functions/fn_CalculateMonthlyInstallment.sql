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