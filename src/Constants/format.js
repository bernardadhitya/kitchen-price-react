export const formattedCurrency = (fee) => {
  const numericToCurrency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });
  return numericToCurrency.format(fee);
}

export const formattedDescription = (description) => {
  return description.length > 100 ? description.slice(0,97) + '...' : description;
}