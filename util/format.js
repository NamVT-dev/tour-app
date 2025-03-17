export function formatDate(date) {
  return date?.slice(0, 16).replace("T", "  ");
}

export function formatPrice(price, currency = "VND") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(price);
}
