export class LoanCalculator {
  static monthlyPayment(
    principal: number,
    annualRate: number,
    termMonths: number
  ): number {
    const monthlyRate = annualRate / 12 / 100;
    if (monthlyRate === 0) {
      return +(principal / termMonths).toFixed(2);
    }
    return +(
      (principal * monthlyRate) /
      (1 - Math.pow(1 + monthlyRate, -termMonths))
    ).toFixed(2);
  }
}
