export function camelize(value: string): string {
  return value
    .split(new RegExp("[_|-]"))
    .map((part: string) => part.substring(0, 1).toUpperCase() + part.substring(1))
    .join("");
}
