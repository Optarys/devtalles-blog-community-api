export function parseEnum<T extends Record<string, string | number>>(
  enumType: T,
  value: string,
  errorMessage?: string
): T[keyof T] {
  const enumValues = Object.values(enumType) as string[];
  if (!enumValues.includes(value)) {
    throw new Error(errorMessage ?? `Invalid enum value: ${value}`);
  }
  return value as T[keyof T];
}
