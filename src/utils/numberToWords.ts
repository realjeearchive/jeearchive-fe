export function numberToWords(num: number): string {
  const ones = [
    "", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", 
    "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", 
    "SEVENTEEN", "EIGHTEEN", "NINETEEN"
  ];
  
  const tens = [
    "", "", "TWENTY", "THIRTY", "FORTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY"
  ];

  if (num === 0) return "ZERO";

  if (num < 20) {
    return ones[num];
  }

  if (num < 100) {
    const ten = Math.floor(num / 10);
    const one = num % 10;
    return tens[ten] + (one !== 0 ? " " + ones[one] : "");
  }

  // Fallback for larger numbers (just return the number string)
  return num.toString();
}