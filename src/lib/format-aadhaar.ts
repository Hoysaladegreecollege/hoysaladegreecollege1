/**
 * Formats an Aadhaar number with spaces every 4 digits.
 * e.g., "123456789012" → "1234 5678 9012"
 */
export function formatAadhaar(aadhaar: string | null | undefined): string {
  if (!aadhaar) return "-";
  const digits = aadhaar.replace(/\D/g, "");
  if (!digits) return aadhaar;
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}
