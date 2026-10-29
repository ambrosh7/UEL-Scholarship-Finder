/** Indian mobile, E.164, default +91. 10 digits starting 6–9. */
export function toE164India(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  let local = digits;
  if (local.startsWith("91") && local.length === 12) {
    local = local.slice(2);
  }
  if (local.length !== 10) return null;
  if (!/^[6-9]/.test(local)) return null;
  return `+91${local}`;
}

export function displayIndiaMobile(e164: string): string {
  if (e164.startsWith("+91") && e164.length === 13) {
    return e164.slice(3);
  }
  return e164;
}
