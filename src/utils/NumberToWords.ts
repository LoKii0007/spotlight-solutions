export const convertNumberToWords = (num: number, type: 'US' | 'India'): string => {
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';

  const convertChunk = (n: number): string => {
    if (n < 10) return units[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + ' ' + units[n % 10];
    if (n < 1000) return units[Math.floor(n / 100)] + ' Hundred ' + convertChunk(n % 100);
    if (n < 100000) return convertChunk(Math.floor(n / 1000)) + ' Thousand ' + convertChunk(n % 1000);
    if (n < 10000000) return convertChunk(Math.floor(n / 100000)) + ' Lakh ' + convertChunk(n % 100000);
    return convertChunk(Math.floor(n / 10000000)) + ' Crore ' + convertChunk(n % 10000000);
  };

  const convertChunkUS = (n: number): string => {
    if (n < 10) return units[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + ' ' + units[n % 10];
    if (n < 1000) return units[Math.floor(n / 100)] + ' Hundred ' + convertChunkUS(n % 100);
    if (n < 1000000) return convertChunkUS(Math.floor(n / 1000)) + ' Thousand ' + convertChunkUS(n % 1000);
    if (n < 1000000000) return convertChunkUS(Math.floor(n / 1000000)) + ' Million ' + convertChunkUS(n % 1000000);
    return convertChunkUS(Math.floor(n / 1000000000)) + ' Billion ' + convertChunkUS(n % 1000000000);
  };

  return type === 'India' ? convertChunk(num).trim() : convertChunkUS(num).trim();
};

// Example usage:
console.log(convertNumberToWords(123456789, 'US')); // "One Hundred Twenty Three Million Four Hundred Fifty Six Thousand Seven Hundred Eighty Nine"
console.log(convertNumberToWords(123456789, 'India')); // "Twelve Crore Thirty Four Lakh Fifty Six Thousand Seven Hundred Eighty Nine"