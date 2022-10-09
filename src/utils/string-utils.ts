export function IsNullOrWhiteSpace(value?: string) {
  return !value || !value.trim();
}
