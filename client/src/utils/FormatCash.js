export const formatCash = (moneyString) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  });

  return formatter.format(moneyString).replace("₫", "");
};
