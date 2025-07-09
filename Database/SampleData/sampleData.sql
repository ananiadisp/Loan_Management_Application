USE LoanManagementDB2025T5;
GO

-- Insert Branches
INSERT INTO Reference.Branches (BranchName, Address, City, State, ZipCode, Phone, Email)
VALUES 
('Central Branch', '123 Main St', 'MetroCity', 'StateA', '12345', '555-1234', 'central@bank.com'),
('East Branch', '456 East St', 'MetroCity', 'StateA', '12346', '555-5678', 'east@bank.com');

-- Insert Loan Products
INSERT INTO Reference.LoanProducts (ProductName, Description, InterestRate, MaxLoanAmount, MinCreditScore, MinTermMonths, MaxTermMonths)
VALUES
('Home Loan', '30-year fixed mortgage', 4.500, 300000, 650, 120, 360),
('Car Loan', '5-year auto loan', 6.000, 50000, 600, 24, 60);

-- Insert Employees
INSERT INTO Reference.Employees (FirstName, LastName, Email, PhoneNumber, Role, HireDate, BranchID)
VALUES
('Alice', 'Johnson', 'alice@bank.com', '555-1111', 'Loan Officer', '2020-01-15', 1),
('Bob', 'Smith', 'bob@bank.com', '555-2222', 'Underwriter', '2019-06-01', 2);

-- Insert Customers
INSERT INTO CoreLoan.Customers (FirstName, LastName, DateOfBirth, Email, PhoneNumber, Address, City, State, ZipCode, CreditScore, RegistrationDate)
VALUES
('John', 'Doe', '1985-03-22', 'john.doe@example.com', '555-3333', '789 North Ave', 'MetroCity', 'StateA', '12347', 700, '2015-04-20'),
('Jane', 'Smith', '1990-07-15', 'jane.smith@example.com', '555-4444', '321 South Rd', 'MetroCity', 'StateA', '12348', 680, '2016-05-10'),
('Carlos', 'Garcia', '1978-11-02', 'carlos.garcia@example.com', '555-5555', '654 West St', 'MetroCity', 'StateA', '12349', 620, '2018-09-18'),
('Emily', 'Brown', '1992-12-01', 'emily.brown@example.com', '555-6666', '852 Park Ln', 'MetroCity', 'StateA', '12350', 710, '2020-01-25'),
('Michael', 'Lee', '1980-02-27', 'michael.lee@example.com', '555-7777', '963 Lakeview', 'MetroCity', 'StateA', '12351', 640, '2021-07-13');

DECLARE @AppID1 INT, @AppID2 INT, @LoanID1 INT, @LoanID2 INT, @AppIDs INT;

-- Insert Loan Applications (auto IDs)
INSERT INTO LoanApp.LoanApplications (CustomerID, LoanProductID, RequestedAmount, ApplicationStatus, AssignedEmployeeID)
OUTPUT INSERTED.ApplicationID INTO @AppIDs
VALUES
(4, 1, 200000, 'Pending', 1),
(5, 2, 25000, 'Pending', 2);

-- Workaround for OUTPUT: insert one by one to capture IDs
INSERT INTO LoanApp.LoanApplications (CustomerID, LoanProductID, RequestedAmount, ApplicationStatus, AssignedEmployeeID)
OUTPUT INSERTED.ApplicationID INTO @AppID1
VALUES (4, 1, 200000, 'Pending', 1);
SELECT @AppID1 = SCOPE_IDENTITY();

INSERT INTO LoanApp.LoanApplications (CustomerID, LoanProductID, RequestedAmount, ApplicationStatus, AssignedEmployeeID)
OUTPUT INSERTED.ApplicationID INTO @AppID2
VALUES (5, 2, 25000, 'Pending', 2);
SELECT @AppID2 = SCOPE_IDENTITY();

-- Insert Loans linked by captured ApplicationIDs
INSERT INTO CoreLoan.Loans (ApplicationID, CustomerID, LoanProductID, ApprovedAmount, DisbursementDate, MaturityDate, InterestRate, CurrentBalance, OriginalTermMonths, LoanStatus)
OUTPUT INSERTED.LoanID INTO @LoanID1
VALUES (@AppID1, 4, 1, 200000, '2024-01-01', '2044-01-01', 4.500, 200000, 240, 'Active');
SELECT @LoanID1 = SCOPE_IDENTITY();

INSERT INTO CoreLoan.Loans (ApplicationID, CustomerID, LoanProductID, ApprovedAmount, DisbursementDate, MaturityDate, InterestRate, CurrentBalance, OriginalTermMonths, LoanStatus)
OUTPUT INSERTED.LoanID INTO @LoanID2
VALUES (@AppID2, 5, 2, 25000, '2024-06-15', '2029-06-15', 6.000, 25000, 60, 'Active');
SELECT @LoanID2 = SCOPE_IDENTITY();

-- Insert Payments for these new loans
INSERT INTO CoreLoan.Payments (LoanID, PaymentDate, PaymentAmount, PaymentType, RecordedByEmployeeID)
VALUES
(@LoanID1, '2024-02-01', 1000, 'Online', 1),
(@LoanID1, '2024-03-01', 1000, 'Online', 1),
(@LoanID2, '2024-07-15', 500, 'Cash', 2),
(@LoanID2, '2024-08-15', 500, 'Cash', 2);

PRINT 'Sample data loaded successfully with dynamic IDs.';