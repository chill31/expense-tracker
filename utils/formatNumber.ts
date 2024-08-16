export default function formatNumber(num: number) {
  if (num >= 10000000) {
    return Math.floor(num / 1000000) / 10 + " Cr";
  } else if (num >= 100000) {
    return Math.floor(num / 10000) / 10 + " L";
  } else {
    return num.toLocaleString();
  }
}