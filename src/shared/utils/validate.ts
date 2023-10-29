import { Profit } from "PlaceOrder/model";

export const validate = (profitRows: Profit[]) => {
  const profitErrors = [] as string[];
  const hasPriceError = profitRows.some(row => row.price <= 0) as boolean;
  const hasValueErrors = profitRows.some(row => row.value <= 0.01) as boolean;
  const hasProfitErrors = profitRows.some((row, index) => index > 0 && row.value <= profitRows[index - 1].value) as boolean;
  const totaValue = profitRows.reduce((total, row) => total + row.value, 0) as number;
  const totalAmount = profitRows.reduce((total, row) => total + row.amount, 0) as number;

  if (hasPriceError) {
    profitErrors.push("Price must be greater than 0");
  } 

  if (hasValueErrors) {
    profitErrors.push("Minimum value is 0.01");
  }

  if (hasProfitErrors) {
    profitErrors.push("Each target's profit should be greater than the previous one");
  }

  if (totaValue > 500) {
    profitErrors.push("Maximum profit sum is 500%");
  };

  if (totalAmount > 100) {
    profitErrors.push(`${totalAmount}% out of 100% selected. Please decrease by ${totalAmount - 100}%`);
  } else if (totalAmount < 100) {
    profitErrors.push(`${totalAmount}% out of 100% selected. Please increase by ${100 - totalAmount}%`);
  };

  return profitErrors;
}

export const updateErrorRows = (profitRows: Profit[]) => {
  const errorRows = new Set<number>();
  
  profitRows.forEach((row, index) => {
    if (row.price <= 0 || row.value <= 0.01 || (index > 0 && row.value <= profitRows[index - 1].value)) {
      errorRows.add(index);
    }
  });
  return errorRows;
};
